import React, { useState, useEffect } from 'react';
import './style.css'
import { FaFilter, FaMapMarkerAlt } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";
import MarkerClusterGroup from 'react-leaflet-markercluster';
import { MdDataExploration, MdOutlineMapsUgc } from "react-icons/md";
import { database } from '../../config/firebaseconfig';
import { addDoc, updateDoc, doc } from "firebase/firestore";
import { collection, getDocs } from 'firebase/firestore';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import iconDengue from '../../assets/images/iconDengue.png';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, BarElement, Title, Tooltip, Legend, LinearScale } from 'chart.js';
import 'leaflet/dist/leaflet.css';
import 'react-leaflet-markercluster/dist/styles.min.css';

// Configuração do ícone do marcador
const customMarkerIcon = L.icon({
  iconUrl: iconDengue, // URL do ícone
  iconSize: [41, 41], // Tamanho do ícone
  iconAnchor: [12, 41], // Ponto do ícone que ficará na posição do marcador
});



ChartJS.register(CategoryScale, BarElement, Title, Tooltip, Legend, LinearScale);

const Denuncias = ({ filtroStatus }) => {
  const navigate = useNavigate();
  const [denuncias, setDenuncias] = useState([]);
  const [selectedDenuncia, setSelectedDenuncia] = useState(null);
  const [showFilter, setShowFilter] = useState(false);
  const [showAllMap, setShowAllMap] = useState(false);
  const [showData, setShowData] = useState(false);
  const [showAllMapCluster, setShowAllMapCluster] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalDescription, setModalDescription] = useState('');
  const [selectedBairros, setSelectedBairros] = useState([]);
  const [denunciasOriginais, setDenunciasOriginais] = useState([]);



  useEffect(() => {
    const fetchDenuncias = async () => {
      try {
        const reportsCollection = collection(database, 'Reports');
        const locationsCollection = collection(database, 'Locations');
        const statusUpdatesCollection = collection(database, 'StatusUpdates');
        const statusObservationsCollection = collection(database, 'Observations');

        const [reportsSnapshot, locationsSnapshot, statusUpdatesSnapshot, observationSnapshot] = await Promise.all([
          getDocs(reportsCollection),
          getDocs(locationsCollection),
          getDocs(statusUpdatesCollection),
          getDocs(statusObservationsCollection)
        ]);

        const fetchedDenuncias = reportsSnapshot.docs.map(doc => {
          const reportData = doc.data();
          const locationData = locationsSnapshot.docs.find(loc => loc.data().reportId === doc.id)?.data() || {};
          const statusData = statusUpdatesSnapshot.docs.find(status => status.data().reportId === doc.id)?.data() || {};
          const observationData = observationSnapshot.docs.find(observation => observation.data().reportId === doc.id)?.data() || {};

          return {
            id: doc.id,
            userId: reportData.userId,
            description: reportData.description,
            photoURL: reportData.photoURL,
            createdAt: reportData.createdAt.toDate().toISOString(),
            location: locationData.nome_localizacao || 'Localização não encontrada',
            status: statusData.status || 'Status não encontrado',
            locationId: locationData.id || '',
            statusId: statusData.id || '',
            latitude: locationData.latitude || null,
            longitude: locationData.longitude || null,
            suburb: locationData.suburb || '',
            observation: observationData.observation || 'Sem atualizações',
          };
        });

        if (filtroStatus) {
          const resultado = fetchedDenuncias.filter(denuncia => denuncia.status === filtroStatus);
          setDenuncias(resultado);
          setDenunciasOriginais(resultado);
        } else {
          setDenuncias(fetchedDenuncias);
          setDenunciasOriginais(fetchedDenuncias);
        }
      } catch (error) {
        console.error("Erro ao buscar denúncias:", error);
      }
    };
    fetchDenuncias();
  }, []);


  const handleSelectDenuncia = (id) => {
    const selected = denuncias.find(denuncia => denuncia.id === id);
    setSelectedDenuncia(selected);


    // Armazenando IDs no localStorage
    localStorage.setItem('reportID', selected.id);
    localStorage.setItem('locationId', selected.locationId);
    localStorage.setItem('statusId', selected.statusId);
  };

  const filteredDenuncias = denuncias.filter(denuncia => {
    const denunciaDate = new Date(denuncia.createdAt);
    const start = startDate ? new Date(startDate) : new Date(0);
    const end = endDate ? new Date(endDate) : new Date();
    return denunciaDate >= start && denunciaDate <= end;
  });


  const filtrarDenuncias = () => {
    return denuncias.filter(denuncia => {
      const denunciaDate = new Date(denuncia.createdAt);
      const start = new Date(startDate);
      const end = new Date(endDate);

      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);

      // Verificando se a data da denúncia está dentro do intervalo, considerando cenários onde apenas uma data é definida
      return (
        (!startDate || denunciaDate >= start) &&
        (!endDate || denunciaDate <= end) &&
        (selectedBairros.length === 0 || selectedBairros.includes(denuncia.suburb))
      );
    });
  };


  const handleAction = (id) => {
    setSelectedDenuncia(denuncias.find(denuncia => denuncia.id === id)); // Armazena a denúncia selecionada
    setShowModal(true);
  };

  const handleModalSubmit = async () => {
    try {
      const userId = localStorage.getItem('userID'); // Obtém o ID do usuário logado
      const reportId = selectedDenuncia.id; // ID da denúncia

      // Atualiza a tabela StatusUpdates
      const statusUpdatesCollection = collection(database, 'StatusUpdates');
      const statusUpdateDoc = await getDocs(statusUpdatesCollection); // Recupera os status atualizados
      const existingStatusUpdate = statusUpdateDoc.docs.find(doc => doc.data().reportId === reportId); // Encontra o documento correspondente

      let newStatus;

      if (existingStatusUpdate) {
        const currentStatus = existingStatusUpdate.data().status; // Pega o status atual

        // Lógica para definir o novo status
        if (currentStatus === 'em análise') {
          newStatus = 'em tratamento';
        } else if (currentStatus === 'em tratamento') {
          newStatus = 'resolvida';
        }

        // Atualiza o documento com o novo status
        await updateDoc(doc(database, 'StatusUpdates', existingStatusUpdate.id), {
          status: newStatus,
          updatedBy: userId,
          updatedAt: new Date(),
        });
      }

      // Salvar a descrição no Firebase na coleção Observations com o novo campo "status"
      if (newStatus) {
        await addDoc(collection(database, 'Observations'), {
          status: newStatus, // Adicionando o novo campo "status"
          observation: modalDescription,
          reportId: reportId,
          createdAt: new Date(),
          createdBy: userId,
        });
      }

      console.log(`Descrição: ${modalDescription} para a denúncia ID: ${selectedDenuncia.id}`);
      setShowModal(false); // Fecha o modal
      setModalDescription(''); // Limpa a descrição

      window.location.reload();
    } catch (error) {
      console.error("Erro ao salvar a observação ou atualizar o status:", error);
    }
  };

  const getButtonText = (status) => {
    switch (status) {
      case 'em análise':
        return 'Enviar para Em Tratamento';
      case 'em tratamento':
        return 'Enviar para Resolvida';
      default:
        return 'Enviar';
    }
  };
  const isButtonDisabled = (status) => {
    return !['em análise', 'em tratamento'].includes(status);
  };
  const limparFiltros = () => {
    setStartDate(''); // Limpa a data de início
    setEndDate(''); // Limpa a data de fim
    setSelectedBairros([]); // Limpa os bairros selecionados
    setDenuncias(denunciasOriginais); // Restaura as denúncias para o estado original
    setShowFilter(false); // Fecha o modal de filtro
  };


  return (
    <div className="home-container">
      <div className="header">
        <IoIosArrowBack size={35} onClick={() => navigate('/home')} />
        <h1> Denúncias {filtroStatus}</h1>
        <div className="icon-container">
          <MdOutlineMapsUgc
            className="icon"
            onClick={() => setShowAllMapCluster(!showAllMapCluster)}
          />
          <MdDataExploration
            className="icon"
            onClick={() => setShowData(!showData)}
          />
          <FaMapMarkerAlt
            className="icon"
            onClick={() => setShowAllMap(!showAllMap)}
          />
          <FaFilter
            className="icon"
            onClick={() => setShowFilter(!showFilter)}
          />
        </div>
      </div>

      {/* Gráfico de casos de dengue por coordenadas (latitude e longitude) */}
      {showData && (
        <div className="graph-container">
          <h3>Casos de Dengue por Bairro</h3>


          <Bar
            data={{
              labels: [...new Set(denuncias.map(denuncia => denuncia.suburb))],
              datasets: [
                {
                  label: 'Casos de Dengue',
                  data: [...new Set(denuncias.map(denuncia => denuncia.suburb))].map(
                    suburb => denuncias.filter(d => d.suburb === suburb).length
                  ),
                  backgroundColor: 'rgba(255, 99, 132, 0.6)',
                  borderColor: 'rgba(255, 99, 132, 1)',
                  borderWidth: 1,
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: {
                legend: { display: false },
                title: {
                  display: true,
                  text: 'Número de Casos de Dengue por Bairro',
                },
              },
              scales: {
                x: { title: { display: true, text: 'Bairros' } },
                y: { title: { display: true, text: 'Número de Casos' }, beginAtZero: true },
              },
            }}
          />
        </div>
      )}


      {/* Mapa com clusters de coordenadas (latitude e longitude) */}
      {showAllMapCluster && (
        <div className="map-container">
          <MapContainer center={[-25.4284, -49.2733]} zoom={5} style={{ height: '400px', width: '100%' }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <MarkerClusterGroup>
              {[...new Set(denuncias.map(denuncia => `${denuncia.latitude},${denuncia.longitude}`))].map(coords => {
                const [latitude, longitude] = coords.split(',').map(Number);
                const coordDenuncias = denuncias.filter(d => d.latitude === latitude && d.longitude === longitude);

                // Pega a primeira denúncia com a mesma coordenada para exibir a localização
                const locationInfo = coordDenuncias[0]?.location || "Localização não disponível";

                return (
                  <Marker key={coords} position={[latitude, longitude]} icon={customMarkerIcon}>
                    <Popup>
                      <h4>Localização: {locationInfo}</h4>
                      <p>Casos de Dengue: {coordDenuncias.length}</p>
                      <ul>
                        {coordDenuncias.map(denuncia => (
                          <li key={denuncia.id}>
                            <strong>ID:</strong> {denuncia.id}, <strong>Status:</strong> {denuncia.status}
                          </li>
                        ))}
                      </ul>
                    </Popup>
                  </Marker>
                );
              })}
            </MarkerClusterGroup>
          </MapContainer>
        </div>
      )}

      {/* Mapa com todas as denúncias sem clustering */}
      {showAllMap && (
        <div className="map-container">
          <MapContainer center={[-23.5505, -46.6333]} zoom={5} style={{ height: '400px', width: '100%' }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {denuncias.map(denuncia => {

              if (denuncia.latitude == null || denuncia.longitude == null) {
                return null; // Ignora a denúncia se latitude ou longitude forem nulas
              }

              // Se ambos são válidos, renderize o marcador
              return (

                <Marker
                  key={denuncia.id}
                  position={[denuncia.latitude, denuncia.longitude]}
                  icon={customMarkerIcon}
                >

                  <Popup>
                    <div>
                      <p><strong>ID:</strong> {denuncia.id}</p>
                      <p><strong>Localização:</strong> {denuncia.location}</p>
                      <p><strong>Status:</strong> {denuncia.status}</p>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
        </div>
      )}


      {showFilter && (
        <div className="filter-form">
          <h3>Filtrar Denúncias</h3>

          {/* Filtro de Data */}
          <label >
            Data de Início:
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </label>

          <label>
            Data de Fim:
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </label>

          {/* Filtro de Bairros */}
          <div style={{ textAlign: 'left', marginTop: '20px', color: '#555' }}>
            <h4 style={{ marginBottom: '10px' }}>Selecione os Bairros</h4>
            {Array.from(new Set(denuncias.map(denuncia => denuncia.suburb))).map((bairro, index) => (
              <label key={index} style={{ display: 'block', marginBottom: '5px' }}>
                <input
                  type="checkbox"
                  value={bairro}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setSelectedBairros(prev => checked
                      ? [...prev, bairro]
                      : prev.filter(b => b !== bairro)
                    );
                  }}
                  style={{ marginRight: '8px' }}
                />
                {bairro}
              </label>
            ))}
          </div>

          {/* Botão para Aplicar Filtro */}
          <button
            onClick={() => {
              const denunciasFiltradas = filtrarDenuncias(); // Filtra as denúncias com base nas datas e bairros
              setDenuncias(denunciasFiltradas); // Atualiza o estado com as denúncias filtradas
              setShowFilter(false); // Fecha o modal de filtro
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#45A049'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#4CAF50'}
          >
            Aplicar Filtro
          </button>

          {/* Botão para Limpar Filtros */}
          <button id='buttonClear'
            onClick={limparFiltros}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#e53935'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#f44336'}
          >
            Limpar Filtragem
          </button>
        </div>
      )}

      <table className="denuncias-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Localização</th>
            <th>Data</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {filteredDenuncias.map(denuncia => (
            <tr key={denuncia.id} onClick={() => handleSelectDenuncia(denuncia.id)} style={{ cursor: 'pointer' }}>
              <td>{denuncia.id}</td>
              <td>{denuncia.location}</td>
              <td>{new Date(denuncia.createdAt).toLocaleDateString()}</td>
              <td>{denuncia.status}</td>
              <td>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAction(denuncia.id);
                  }}
                  style={{ padding: '5px 10px', backgroundColor: '#007BFF', color: 'white', border: 'none', borderRadius: '5px' }}>
                  Ação
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Denúncia unitaria */}

      {selectedDenuncia && (
        <div
          className="main-content"
        >
          <h2>
            Detalhes da Denúncia ID: {selectedDenuncia.id}
          </h2>
          <p>
            <strong>Descrição:</strong> {selectedDenuncia.description}
          </p>

          <p>
            <strong>Status:</strong> {selectedDenuncia.status}
          </p>

          <p>
            <strong>Atualizações:</strong> {selectedDenuncia.observation}
          </p>

          <p>
            <strong>Imagem da denúncia</strong></p>
          <img
            src={selectedDenuncia.photoURL}
            alt="Denúncia" 
          />

          {selectedDenuncia.latitude && selectedDenuncia.longitude && (
            <MapContainer center={[selectedDenuncia.latitude, selectedDenuncia.longitude]} zoom={15} style={{ height: '300px', marginTop: '20px', borderRadius: '8px' }}>
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <Marker position={[selectedDenuncia.latitude, selectedDenuncia.longitude]} icon={customMarkerIcon}>
                <Popup>
                  <div>
                    <p><strong>ID:</strong> {selectedDenuncia.id}</p>
                    <p><strong>Localização:</strong> {selectedDenuncia.location}</p>
                    <p><strong>Status:</strong> {selectedDenuncia.status}</p>
                  </div>
                </Popup>
              </Marker>
            </MapContainer>
          )}
        </div>
      )}
      {/* Atualização de status */}
      {showModal && (
        <div className="modal">
          <div>
            <h2>Descrição da Denúncia {filtroStatus}</h2>
            <textarea
              value={modalDescription}
              onChange={(e) => setModalDescription(e.target.value)}
              rows="4"
            />
            <button
              onClick={() => {
                if (!modalDescription) {
                  alert("Por favor, preencha a descrição antes de salvar."); // Alerta caso a descrição esteja vazia
                } else {
                  handleModalSubmit();
                }
              }}
              style={{
                padding: '10px 15px',
                backgroundColor: isButtonDisabled(selectedDenuncia?.status) ? '#d3d3d3' : '#28a745',
                color: 'white',
                cursor: isButtonDisabled(selectedDenuncia?.status) ? 'not-allowed' : 'pointer',
                opacity: isButtonDisabled(selectedDenuncia?.status) ? 0.7 : 1
              }}
              disabled={isButtonDisabled(selectedDenuncia?.status)}
            >
              {getButtonText(selectedDenuncia?.status)}
            </button>
            <button
              onClick={() => setShowModal(false)} style={{ padding: '10px 15px', backgroundColor: '#dc3545', color: 'white', marginLeft: '10px' }}>
              Fechar
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default Denuncias;

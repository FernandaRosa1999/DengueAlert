import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { database } from '../../config/firebaseconfig';
import { IoIosLogOut } from "react-icons/io";
import { collection, getDocs } from 'firebase/firestore';
import Logo from '../../assets/images/LogoDengueAlert.png'
import './home.css';

function Home() {
  const navigate = useNavigate();
  const [statusCount, setStatusCount] = useState({ emAberto: 0, emTratamento: 0, resolvida: 0 });
  const [totalDenuncias, setTotalDenuncias] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDenuncias = async () => {
      try {
        // Referência para a coleção de status
        const statusUpdatesCollection = collection(database, 'StatusUpdates');
        
        // Obtendo todos os documentos da coleção de StatusUpdates
        const statusUpdatesSnapshot = await getDocs(statusUpdatesCollection);
        
        // Resetando os contadores antes de recalcular
        let emAberto = 0;
        let emTratamento = 0;
        let resolvida = 0;

        // Verificando cada documento de status
        statusUpdatesSnapshot.docs.forEach(doc => {
          const statusData = doc.data();

          // Incrementando contadores com base no status
          switch (statusData.status) {
            case 'em análise':
              emAberto++;
              break;
            case 'em tratamento':
              emTratamento++;
              break;
            case 'resolvida':
              resolvida++;
              break;
            default:
              break;
          }
        });

        // Atualizando os estados
        setStatusCount({ emAberto, emTratamento, resolvida });
        setTotalDenuncias(emAberto + emTratamento + resolvida); // Soma total de denúncias

      } catch (error) {
        console.error("Erro ao buscar denúncias: ", error);
        setError("Erro ao carregar as denúncias.");
      }
    };

    fetchDenuncias();
  }, []);

  return (
    <div className="home-container">
      <header className="header">
     
        <div className="logo" > <img src={Logo} style={{ maxWidth: '15%', height: 'auto', marginRight: '80%' }}/></div>
        <nav className="nav">
          <ul>
            <li><Link to="/home">Home</Link></li>
            <li><Link to="/about">Sobre</Link></li>
            <li><Link to="/contact">Contato</Link></li>
            <li><Link to="/denuncias">Denúncias</Link></li>
            <li><IoIosLogOut size={25} onClick={() => navigate('/')}/></li>
          </ul>
        </nav>
      </header>

      <main className="main-content">
        <h1>Bem-vindo ao DengueAlert</h1>

        <p>Aqui você encontrará informações sobre as denúncias de surtos de dengue.</p>

        {error && <p className="error-message">{error}</p>}

        <table className="denuncias-table">
          <thead>
            <tr>
              <th>Total de denúncias</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{totalDenuncias}</td>
            </tr>
          </tbody>
        </table>

        <h2>Status das Denúncias</h2>
        <div className="status-table">
          <div className="status-column clickable" onClick={() => navigate('/analise')}>
            <h3>Em Análise</h3>
            <p>{statusCount.emAberto} Denúncias</p>
          </div>
          <div className="status-column clickable" onClick={() => navigate('/tratamento')}>
            <h3>Em Tratamento</h3>
            <p>{statusCount.emTratamento} Denúncias</p>
          </div>
          <div className="status-column clickable" onClick={() => navigate('/resolvida')}>
            <h3>Resolvida</h3>
            <p>{statusCount.resolvida} Denúncias</p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Home;

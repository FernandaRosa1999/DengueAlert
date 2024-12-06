<h1>DengueAlert</h1>
<h2>Descrição do Projeto</h2>
<p>O DengueAlert é um aplicativo desenvolvido em React Native que permite aos usuários registrar denúncias relacionadas a possíveis focos de dengue. As funcionalidades incluem captura de fotos, seleção de imagens da galeria, geolocalização para indicar o local exato do incidente e armazenamento local das informações. O aplicativo é executado exclusivamente no Expo, com suporte a depuração via cabo conectado ao PC.</p>
<h2>Como Rodar o aplicativo DengueAlert</h2>
<ol>
  <li>Clonar o Repositório</li>
  <p>  
  ```bash
  git clone https://github.com/FernandaRosa1999/DengueAlert.git
  cd DengueAlert
  ```
  </p>
  <li>Configurar e Rodar o Servidor Express</li>
  <ul>
  <li>Acesse a pasta do servidor Express:<a href='https://github.com/FernandaRosa1999/DengueAlert/tree/main/appDengueAlert/src/config'> config </a></li>
  <li>Instale as dependências do servidor:</li>
  <p>
     ```
  npm install
  ```
  </p>
  <li>Inicie o servidor Express:</li>
  <p>
  ```
  node server.js
  ```
  </p>
  <p>O servidor será iniciado por padrão na porta 3000.</p>
  <li>Verifique o IP da máquina: Certifique-se de usar o IP correto da máquina local no mesmo Wi-Fi que o dispositivo ou emulador. Você pode verificar seu IP com o comando:</li>
  <p>```
  ipconfig (Windows) ou ifconfig (Linux/Mac)
  ```</p>
  <li>Atualize o endereço do servidor no aplicativo:</li>
    <p>const serverResponse = await fetch('http://SEU_IP_LOCAL:3000/upload', {</p>
    <p> Substitua SEU_IP_LOCAL pelo endereço IP da sua máquina. </p>
    <p><a href='https://github.com/FernandaRosa1999/DengueAlert/blob/main/appDengueAlert/src/pages/newComplaint/photograph.js'>photograph.js</a> linha 54</p>
    <p><a href='https://github.com/FernandaRosa1999/DengueAlert/blob/main/appDengueAlert/src/pages/newComplaint/upload.js'>upload.js</a> linha 64</p>
  </ul>
  <li>Rodar o Aplicativo React Native</li>
  <p>Volte para a pasta do aplicativo:<a href='https://github.com/FernandaRosa1999/DengueAlert/tree/main/appDengueAlert'>appDengueAlert</a></p>
  <ul>
    <li>Instale as dependências:</li>
    <p>```npm install```</p>
    <li>Inicie o servidor Expo:</li>
    <p>```expo start```</p>
    <li>Conecte o dispositivo ou emulador:</li>
    <p>Dispositivo físico: Conecte via cabo USB com Depuração USB ativada.</p>
    <p>Emulador: Certifique-se de que está na mesma rede que o servidor Express.</p>
    <li>Execute o aplicativo:</li>
    <p>Abra o Expo Go no dispositivo físico e escaneie o QR code.</p>
    <p>Para emuladores, use o comando correspondente no terminal.</p>
  </ul>
</ol>
<h3>Bibliotecas Principais do Aplicativo</h3>
<ul>
  <li><strong>react-native-camera:</strong> Captura fotos diretamente da câmera.</li>
  <li><strong>expo-image-picker: </strong>Seleção de imagens da galeria.</li>
  <li><strong>@react-navigation/native: </strong>Navegação entre telas.</li>
  <li><strong>async-storage:</strong> Armazenamento local para funcionamento offline.</li>
  <li><strong>react-native-maps:</strong> Exibição de mapas e localização das denúncias.</li>
  <li><strong>Axios:</strong> Comunicação com o servidor Express para upload de dados.</li>
</ul>







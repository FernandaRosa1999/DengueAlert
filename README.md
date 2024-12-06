<h1>DengueAlert</h1>
<h2>Descrição do Aplicativo</h2>
<p>O Aplicativo DengueAlert é desenvolvido em React Native que permite aos usuários registrar denúncias relacionadas a possíveis focos de dengue. As funcionalidades incluem captura de fotos, seleção de imagens da galeria, geolocalização para indicar o local exato do incidente e armazenamento local das informações. O aplicativo é executado exclusivamente no Expo, com suporte a depuração via cabo conectado ao PC.</p>

<h3>Como Rodar</h3>
<ol>
  <li><strong>Clonar o Repositório</strong></li>
  <div class="code-block">
    <pre><code>git clone https://github.com/FernandaRosa1999/DengueAlert.git
    cd DengueAlert
    cd appDengueAlert</code></pre>
  </div>

  <li><strong>Configurar e Rodar o Servidor Express</strong></li>
  <ul>
    <li><strong>Acesse a pasta do servidor Express:</strong> <a href='https://github.com/FernandaRosa1999/DengueAlert/tree/main/appDengueAlert/src/config'>config</a></li>
    <li><strong>Instale as dependências do servidor:</strong></li>
    <div class="code-block">
      <pre><code>npm install</code></pre>
    </div>
    <li><strong>Inicie o servidor Express:</strong></li>
    <div class="code-block">
      <pre><code>node server.js</code></pre>
    </div>
    <p>O servidor será iniciado por padrão na porta 3000.</p>
    <li><strong>Verifique o IP da máquina: Certifique-se de usar o IP correto da máquina local no mesmo Wi-Fi que o dispositivo ou emulador. Você pode verificar seu IP com o comando:</strong></li>
    <div class="code-block">
      <pre><code>ipconfig (Windows) ou ifconfig (Linux/Mac)</code></pre>
    </div>
    <li><strong>Atualize o endereço do servidor no aplicativo:</strong></li>
    <p>const serverResponse = await fetch('http://SEU_IP_LOCAL:3000/upload', {</p>
    <p>Substitua SEU_IP_LOCAL pelo endereço IP da sua máquina.</p>
    <p><a href='https://github.com/FernandaRosa1999/DengueAlert/blob/main/appDengueAlert/src/pages/newComplaint/photograph.js'>photograph.js</a> linha 54</p>
    <p><a href='https://github.com/FernandaRosa1999/DengueAlert/blob/main/appDengueAlert/src/pages/newComplaint/upload.js'>upload.js</a> linha 64</p>
  </ul>

  <li><strong>Rodar o Aplicativo React Native</strong></li>
  <p>Volte para a pasta do aplicativo: <a href='https://github.com/FernandaRosa1999/DengueAlert/tree/main/appDengueAlert'>appDengueAlert</a></p>
  <ul>
    <li><strong>Instale as dependências:</strong></li>
    <div class="code-block">
      <pre><code>npm install</code></pre>
    </div>
    <li><strong>Inicie o servidor Expo:</strong></li>
    <div class="code-block">
      <pre><code>expo start</code></pre>
    </div>
    <li><strong>Conecte o dispositivo ou emulador:</strong></li>
    <p>Dispositivo físico: Conecte via cabo USB com Depuração USB ativada.</p>
    <p>Emulador: Certifique-se de que está na mesma rede que o servidor Express.</p>
    <li><strong>Execute o aplicativo:</strong></li>
    <p>Abra o Expo Go no dispositivo físico e escaneie o QR code.</p>
    <p>Para emuladores, use o comando correspondente no terminal.</p>
  </ul>
</ol>

<h3>Bibliotecas Principais do Aplicativo</h3>
<ul>
  <li><strong>react-native-camera:</strong> Captura fotos diretamente da câmera.</li>
  <li><strong>expo-image-picker:</strong> Seleção de imagens da galeria.</li>
  <li><strong>@react-navigation/native:</strong> Navegação entre telas.</li>
  <li><strong>async-storage:</strong> Armazenamento local para funcionamento offline.</li>
  <li><strong>react-native-maps:</strong> Exibição de mapas e localização das denúncias.</li>
  <li><strong>Axios:</strong> Comunicação com o servidor Express para upload de dados.</li>
</ul>
<h2>DengueAlert - Site</h2>
<h2>Descrição do Projeto</h2>

<p>O <strong>DengueAlert</strong> é um site desenvolvido em React que complementa o aplicativo móvel, permitindo a gestão e visualização de denúncias relacionadas a focos de dengue. Ele possibilita que profissionais de saúde e autoridades acompanhem as denúncias registradas no aplicativo, analisem dados por meio de gráficos e mapas interativos, e filtrem as informações para tomadas de decisão rápidas e precisas.</p>

<h3>Funcionalidades do Site</h3>
<ul>
<li><strong>Visualização de Denúncias:</strong> Exibe a lista de denúncias registradas no aplicativo, agrupadas por bairro.</li>
<li><strong>Mapa Interativo:</strong> Mostra a localização das denúncias em um mapa, com marcadores agrupados.</li>
<li><strong>Gráficos de Análise:</strong> Apresenta gráficos que mostram a quantidade de denúncias por bairro.</li>
<li><strong>Filtros Avançados:</strong> Permite filtrar as denúncias por status, localização e data.</li>
</ul>
<h3>Como Rodar o Site DengueAlert</h3>
<ol>
  <li><strong>Clonar o Repositório</strong></li>
  <p>Se o repositorio não foi clonado, clone-o</p>
  <div class="code-block">
      <pre><code>git clone https://github.com/FernandaRosa1999/DengueAlert.git</code></pre>
    </div>
  <li><strong>acesse a pasta </strong><a href="https://github.com/FernandaRosa1999/DengueAlert/tree/main/dengue_alert_site">dengue_alert_site</a></li>
    <div class="code-block">
      <pre><code>cd DengueAlert 
      cd dengue_alert_site</code></pre>
    </div>
    <li><strong>Instalar Dependências</strong></li>
    <div class="code-block">
      <pre><code>npm install</code></pre>
    </div>
    <li><strong>Rodar o Site</strong></li>
    <div class="code-block">
      <pre><code>npm start</code></pre>
    </div>
</ol>
<h3>Bibliotecas Principais do Site</h3>
<ul>
  <li><strong>React-Router-Dom:</strong> Gerencia a navegação dinâmica entre páginas em uma SPA, suportando rotas protegidas e parâmetros via URL.</li>
  <li><strong>React-Leaflet:</strong> Exibe mapas interativos com marcadores agrupados, facilitando a análise visual por bairro.</li>
  <li><strong>Chart.js:</strong> Cria gráficos de barras para exibir denúncias por bairro, integrando-se facilmente com React.</li>
</ul>






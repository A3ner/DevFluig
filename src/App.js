import React from "react";
import SearchBar from "./componentes/SearchBar";
import "./App.css"; // caso queira separar o CSS
// import "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css";

function App() {
  return (
    <div className="app">
      {/* Sidebar */}
      <div className="sidebar">
        <i className="fa-solid fa-gears" title="Environments">Documentos</i>
        <i className="fa-solid fa-table-cells" title="More">Dataset</i>
        <i className="fa-solid fa-table-cells" title="More">Processos</i>
        <i className="fa-solid fa-table-cells" title="More">Serviços</i>
        <i className="fa-solid fa-layer-group active" title="Collections">Usuário</i>
        <i className="fa-solid fa-diagram-project" title="Flows">Grupo</i>
        <i className="fa-solid fa-clock-rotate-left" title="History">Papel</i>
        
      </div>

      {/* Main */}
      <div className="main">
        {/* Header */}
        <div className="header">
          <div className="title">DevFluig</div>
          <div className="buttons">
            <button>Admin</button>
            <button>Baixar Log</button>
            <button>Dark Mode</button>
          </div>
        </div>

        {/* Search */}
        <div className="search">
          <div>
            <SearchBar placeholder="Buscar Solicitação" onSearch={(q) => console.log("Buscando:", q)} />
          </div>
            <SearchBar placeholder="Buscar Documento" onSearch={(q) => console.log("Buscando:", q)} />
        </div>

        {/* Collections */}
        <div className="collections">
          <div className="item">
            <i className="fa-solid fa-caret-right"></i> Informações de Formulário
          </div>
          <div className="item">
            <i className="fa-solid fa-caret-right"></i> Processos
          </div>
        </div>

        {/* Footer */}
        <div className="footer">
          <span>Online</span>
          <span>Painel</span>
          <span>Git</span>
        </div>
      </div>
    </div>
  );
}

export default App;

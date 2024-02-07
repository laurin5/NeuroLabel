import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function App() {
  let navigator = useNavigate();

  useEffect(() => {
    localStorage.getItem("sessionid") == null ? "" : navigator("/projects");
  });

  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-white text-2xl mt-[10%]">
        Willkommen bei NeuroLabel
      </h1>
      <p className="text-white text-lg w-[60%] italic mt-6 text-center">
        NeuroLabel ist Ihre Plattform zur gemeinsamen Datenerfassung für die
        Entwicklung hochwertiger KI. Wir laden Sie ein, Teil unserer Community
        zu werden und Daten beizutragen, um die nächste Generation von
        KI-Technologien voranzutreiben. Treten Sie noch heute bei und gestalten
        Sie die Zukunft der KI mit uns!
      </p>
      <div className="w-full flex items-center justify-center gap-6 text-white mt-10">
        <button
          className="border-[1px] px-4 py-2 hover:bg-white hover:text-gray-800 duration-300 rounded-md text-lg"
          onClick={() => navigator("/register")}
        >
          Registrieren
        </button>
        <button
          className="border-[1px] px-4 py-2 hover:bg-white hover:text-gray-800 duration-300 rounded-md text-lg"
          onClick={() => navigator("/login")}
        >
          Einloggen
        </button>
      </div>
    </div>
  );
}

export default App;

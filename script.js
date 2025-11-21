async function buscarPokemon() {
    const entradaElem = document.getElementById("entrada");
    const cardElem = document.getElementById("card");

    const raw = entradaElem.value.trim();
    if (!raw) {
        cardElem.innerHTML = "<p>Digite um nome ou número do Pokémon.</p>";
        return;
    }

    // Remove '#' inicial e normaliza input: se for só dígitos, converte para número (remove zeros à esquerda)
    let query = raw.replace(/^#/, "");
    if (/^\d+$/.test(query)) {
        query = String(Number(query));
    } else {
        query = query.toLowerCase();
    }

    const url = `https://pokeapi.co/api/v2/pokemon/${encodeURIComponent(query)}`;

    try {
        console.log("Buscando:", query, url);
        const resposta = await fetch(url);

        if (!resposta.ok) {
            cardElem.innerHTML = "<p>Pokémon não encontrado</p>";
            return;
        }

        const dados = await resposta.json();


        const id = String(dados.id).padStart(3, '0');
        const nome = dados.name.toUpperCase();
        const imagem = dados.sprites?.other?.['official-artwork']?.front_default || dados.sprites?.front_default || '';
        const tipo = dados.types.map(t => t.type.name).join(", ");
        const peso = (dados.weight / 10).toFixed(1);
        const altura = (dados.height / 10).toFixed(1);

        const cores = {
            fire: "#ff9c54", water: "#4fc3f7", grass: "#81c784", electric: "#ffd54f",
            psychic: "#ff80ab", normal: "#b0bec5", fighting: "#d32f2f", poison: "#ba68c8",
            ground: "#d7ccc8", flying: "#81d4fa", rock: "#8d6e63", bug: "#aed581",
            ghost: "#9575cd", dark: "#616161", dragon: "#7986cb", steel: "#90a4ae",
            fairy: "#f48fb1", ice: "#4dd0e1",
        };
        const tipoPrincipal = dados.types[0]?.type?.name || "";
        const corDeFundo = cores[tipoPrincipal] || "#fff";

        cardElem.innerHTML = `
            <div style="background:${corDeFundo}; padding:20px; border-radius:15px">
                <h2>${id} - ${nome}</h2>
                <img src="${imagem}" alt="${nome}">
                <p><strong>Tipo:</strong> ${tipo}</p>
                <p><strong>Altura:</strong> ${altura} m</p>
                <p><strong>Peso:</strong> ${peso} kg</p>
            </div>
        `;
    } catch (erro) {
        console.error(erro);
        cardElem.innerHTML = "<p>Erro ao buscar o Pokémon.</p>";
    }
}

// Permite buscar ao pressionar Enter no input
document.getElementById("entrada").addEventListener("keydown", (e) => {
    if (e.key === "Enter") buscarPokemon();
});
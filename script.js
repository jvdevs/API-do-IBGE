document.getElementById('rota').addEventListener('change', function() {
    const rota = document.getElementById('rota').value;
    const localidadeField = document.getElementById('localidade-field');
    const groupByField = document.getElementById('groupby-field');
    const paisField = document.getElementById('pais-field');

    localidadeField.style.display = 'none';
    groupByField.style.display = 'none';
    paisField.style.display = 'none';

    if (rota === 'rota2') {
        localidadeField.style.display = 'block';
    } else if (rota === 'rota3') {
        groupByField.style.display = 'block';
    } else if (rota === 'rota4') {
        paisField.style.display = 'block';
    }
});

document.getElementById('search-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const rota = document.getElementById('rota').value;
    const nome = 'joao';
    const localidade = document.getElementById('localidade').value || 'BR';
    const groupBy = document.getElementById('groupBy').value;
    const pais = document.getElementById('pais').value;

    let url = '';

    if (rota === 'rota1') {
        url = `https://servicodados.ibge.gov.br/api/v2/censos/nomes/${nome}`;
    } else if (rota === 'rota2') {
        url = `https://servicodados.ibge.gov.br/api/v2/censos/nomes/${nome}?localidade=${localidade}`;
    } else if (rota === 'rota3') {
        url = `https://servicodados.ibge.gov.br/api/v2/censos/nomes/${nome}?groupBy=UF`;
    } else if (rota === 'rota4') {
        url = `https://servicodados.ibge.gov.br/api/v1/paises/${pais}`;
    }

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const resultSection = document.getElementById('result');
            resultSection.innerHTML = '';

            if (rota === 'rota4') {
                if (data.length === 0) {
                    resultSection.innerHTML = '<p>Nenhum resultado encontrado.</p>';
                    return;
                }
                const countryInfo = data[0];
                resultSection.innerHTML = `
                    <div>
                        <h3>País: ${countryInfo.nome.abreviado || 'Não informado'}</h3>
                        <p>Localização: ${countryInfo.localizacao?.regiao?.nome || 'Não informado'}</p>
                        <p>Lingua: ${countryInfo.linguas?.map(lang => lang.nome).join(', ') || 'Não informado'}</p>
                        <p>Área: ${countryInfo.area?.total || 'Não informado'} km²</p>
                    </div>
                `;
            } else {
                if (data.length === 0 || !data[0]?.res?.length) {
                    resultSection.innerHTML = '<p>Nenhum resultado encontrado.</p>';
                    return;
                }
                data.forEach(item => {
                    const res = item.res;
                    res.forEach(entry => {
                        const periodo = entry.periodo || 'Não informado';
                        const frequencia = entry.frequencia || 'Não informado';
                        const sexo = entry.sexo || 'Indefinido';
                        const localidadeDisplay = entry.localidade || 'BR';

                        if (rota === 'rota3') {
                            const populacao = entry.populacao || 'Não informado';
                            const proporcao = ((entry.frequencia / populacao) * 100).toFixed(2) || 'Não informado';
                            resultSection.innerHTML += `
                                <div>
                                    <p>Localidade: ${localidadeDisplay}</p>
                                    <p>População: ${populacao}</p>
                                    <p>Frequência: ${frequencia}</p>
                                    <p>Proporção: ${proporcao}%</p>
                                </div>
                            `;
                        } else {
                            resultSection.innerHTML += `
                                <div>
                                    <h3>Nome: ${nome.toUpperCase()}</h3>
                                    <p>Período: ${periodo}</p>
                                    <p>Frequência: ${frequencia}</p>
                                    <p>Sexo: ${sexo}</p>
                                    <p>Localidade: ${localidadeDisplay}</p>
                                </div>
                            `;
                        }
                    });
                });
            }
        })
        .catch(error => {
            console.error('Erro:', error);
            const resultSection = document.getElementById('result');
            resultSection.innerHTML = '<p>Ocorreu um erro ao buscar os dados.</p>';
        });
});

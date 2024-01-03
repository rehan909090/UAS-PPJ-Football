
// Mengambil data klasemen dari endpoint '/standings' menggunakan JavaScript
fetch('/standings')
  .then(response => response.json())
  .then(data => {
    const standingsBody = document.getElementById('standingsBody');

    // Menampilkan data klasemen ke dalam tabel
    data.forEach(team => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${team.position}</td>
        <td>${team.name}</td>
        <td>${team.playedGames}</td>
        <td>${team.won}</td>
        <td>${team.drawn}</td>
        <td>${team.lost}</td>
        <td>${team.points}</td>
      `;
      standingsBody.appendChild(row);
    });
  })
  .catch(error => {
    console.error('Error fetching standings:', error);
    // Menampilkan pesan error jika terjadi masalah saat mengambil data
    const standingsBody = document.getElementById('standingsBody');
    const errorRow = document.createElement('tr');
    errorRow.innerHTML = `<td colspan="8">Gagal mengambil data klasemen</td>`;
    standingsBody.appendChild(errorRow);
  });

  

// Fungsi untuk memformat tanggal dari format UTC ke format yang lebih mudah dibaca
function formatDate(dateString) {
  const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', timeZone: 'UTC' };
  return new Date(dateString).toLocaleDateString('id-ID', options);
}

// Mengambil data pertandingan dari endpoint '/matches' dan menampilkannya dalam tabel di halaman HTML
const matchesContainer = document.getElementById('matches');

fetch('/matches')
  .then(response => response.json())
  .then(data => {
    const sortedMatches = data.matches.sort((a, b) => new Date(b.utcDate) - new Date(a.utcDate));

    sortedMatches.forEach(match => {
      const matchCard = document.createElement('div');
      matchCard.classList.add('match-card');

      const homeTeamName = document.createElement('p');
      homeTeamName.textContent = match.homeTeam.name;

      const versusText = document.createElement('p');
      versusText.textContent = 'vs';

      const awayTeamName = document.createElement('p');
      awayTeamName.textContent = match.awayTeam.name;

      const matchDate = document.createElement('p');
      matchDate.textContent = formatDate(match.utcDate);

      matchCard.appendChild(homeTeamName);
      matchCard.appendChild(versusText);
      matchCard.appendChild(awayTeamName);
      matchCard.appendChild(document.createElement('br'));
      matchCard.appendChild(document.createElement('br'));
      matchCard.appendChild(matchDate);

      matchesContainer.appendChild(matchCard);
    });
  })
  .catch(error => {
    console.error('Error fetching matches:', error);
    const errorCard = document.createElement('div');
    errorCard.classList.add('match-card');
    errorCard.innerHTML = `<p>Failed to fetch matches</p>`;
    matchesContainer.appendChild(errorCard);
  });


  
// Mendapatkan daftar tim dari server
async function getTeams() {
    try {
      const response = await fetch('/teams');
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching teams:', error);
      return [];
    }
  }
  
  // Menampilkan daftar tim ke dalam HTML
  async function showTeams() {
    const teamsContainer = document.getElementById('teams');
  
    const teams = await getTeams();
  
    teams.forEach(team => {
      const teamCard = document.createElement('div');
      teamCard.classList.add('team-card');
  
      const teamImage = document.createElement('img');
      teamImage.src = team.crestUrl;
      teamImage.alt = team.name;
      teamImage.classList.add('team-logo');
  
      const teamName = document.createElement('p');
      teamName.textContent = team.name;
  
      teamCard.appendChild(teamImage);
      teamCard.appendChild(teamName);
  
      teamsContainer.appendChild(teamCard);
    });
  }
  
  // Panggil fungsi untuk menampilkan daftar tim saat halaman dimuat
  showTeams();

  
// script.js
document.addEventListener('DOMContentLoaded', function() {
  const introContainer = document.querySelector('.intro-container');

  window.addEventListener('scroll', function() {
    const introPosition = introContainer.getBoundingClientRect().top;
    const screenHeight = window.innerHeight;

    if (introPosition < screenHeight / 1.5) {
      introContainer.classList.add('scroll-show');
    }
  });
});

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const axios = require('axios');
const app = express();
const session = require('express-session');
const bcrypt = require('bcrypt');

// Koneksi ke MongoDB menggunakan Mongoose
mongoose.connect('mongodb://localhost:27017/football', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Skema dan model untuk pengguna
const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String, // Bidang untuk menyimpan password yang di-hash
  // Tambahkan bidang lain sesuai kebutuhan
});

const User = mongoose.model('User', userSchema);

// Middleware untuk mengakses body pada request
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'views')));

// Route to redirect to login page when accessing root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'login.html'));
});
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
  
    // Dapatkan informasi pengguna dari database berdasarkan username/email
    const user = await User.findOne({ username }); // Misalnya menggunakan Mongoose
  
    if (!user) {
      return res.status(400).send('Username tidak ditemukan');
    }
  
    // Bandingkan sandi yang dimasukkan dengan sandi yang di-hash
    const isPasswordValid = await bcrypt.compare(password, user.password);
  
    if (!isPasswordValid) {
      return res.status(400).send('Sandi salah');
    }
  
    // Jika sandi benar, arahkan ke halaman home
    res.redirect('/home');
  });

// Route to serve signup page
app.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'signup.html'));
});

// Route to handle signup form submission
app.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Hash password menggunakan bcrypt
    const hashedPassword = await bcrypt.hash(password, 10); // 10 adalah salt rounds
    
    // Buat instance User baru dengan password yang di-hash
    const newUser = new User({ username, email, password: hashedPassword });
    
    // Simpan data pengguna ke MongoDB
    await newUser.save();
    
    // Redirect to login page after signup
    res.redirect('/');
  } catch (error) {
    console.error(error);
    res.status(500).send('Gagal menyimpan pengguna.');
  }
});
app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'home.html'));
  });
  

  // Fungsi untuk memanggil klasemen
  app.get('/standings', async (req, res) => {
    try {
      const response = await axios.get('https://api.football-data.org/v4/competitions/PL/standings', {
        headers: {
          'X-Auth-Token': '5e1e52e4ef0e432db37e6a4491a619b2' // Ganti dengan API key Anda
        }
      });
  
      const standingsData = response.data;
  
      // Menyusun data klasemen sesuai kebutuhan
      const formattedData = standingsData.standings[0].table.map(team => ({
        position: team.position,
        name: team.team.name,
        playedGames: team.playedGames,
        won: team.won,
        drawn: team.draw,
        lost: team.lost,
        points: team.points
      }));
  
      res.json(formattedData);
    } catch (error) {
      console.error('Error fetching standings:', error);
      res.status(500).json({ error: 'Failed to fetch standings' });
    }
  });
  
  // Endpoint untuk mendapatkan pertandingan Liga Primer
app.get('/matches', async (req, res) => {
  try {
    // Lakukan permintaan ke API untuk mendapatkan data pertandingan
    // Contoh endpoint dan penggunaan API key
    const apiKey = '5e1e52e4ef0e432db37e6a4491a619b2'; // Ganti dengan API key yang valid
    const apiUrl = 'https://api.football-data.org/v4/competitions/PL/matches'; // Ganti dengan endpoint yang sesuai

    // Lakukan permintaan menggunakan axios atau metode lainnya
    const response = await axios.get(apiUrl, {
      headers: {
        'X-Auth-Token': apiKey,
      },
    });

    // Kirim data pertandingan sebagai respons
    const matchesData = response.data;
    res.json(matchesData);
  } catch (error) {
    console.error('Error fetching matches:', error);
    res.status(500).json({ error: 'Failed to fetch matches' });
  }
});

// Endpoint untuk mendapatkan daftar tim Premier League
app.get('/teams', async (req, res) => {
  try {
    const apiKey = '5e1e52e4ef0e432db37e6a4491a619b2'; // Ganti dengan API key yang valid
    const apiUrl = 'https://api.football-data.org/v2/competitions/PL/teams'; // Ganti dengan endpoint yang sesuai

    const response = await fetch(apiUrl, {
      headers: {
        'X-Auth-Token': apiKey,
      },
    });

    const teamsData = await response.json();
    const teams = teamsData.teams.map(team => ({
      name: team.name,
      crestUrl: team.crestUrl, // Pastikan properti crestUrl berisi URL gambar
    }));

    res.json(teams);
  } catch (error) {
    console.error('Error fetching teams:', error);
    res.status(500).json({ error: 'Failed to fetch teams' });
  }
});

// Endpoint untuk logout
app.post('/logout', (req, res) => {
  // Membersihkan session atau melakukan tindakan logout lainnya
  // ...

  // Redirect kembali ke halaman login setelah logout
  res.redirect('/login');
});

// Endpoint untuk halaman login
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

  
  // Mulai server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
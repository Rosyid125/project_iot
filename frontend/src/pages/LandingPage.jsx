import React from "react";
import "../assets/style.css";
import logolanding from "../logolanding.png";
import Iot1 from "../assets/img1.jpg";
import Iot2 from "../assets/img2.jpg";
import Iot3 from "../assets/img3.jpg";
import Iot4 from "../assets/img4.jpg";

function LandingPage() {
  return (
    <div className="body">
      <section id="parallax-1" class="hero is-large bg1">
        <nav className="nav-item">
          <h1 class="logo">
            <a href="/">
              <img src={logolanding} alt="logolanding" />
            </a>
          </h1>
          <a href="/login" className="button is-warning">
            Login
          </a>
        </nav>
        <div class="header-title">Automatic Roof Controller</div>
        <div class="look-down">Scroll kebawah untuk informasi lebih lanjut</div>
        <div>
          <div class="container">
            <div class="columns">
              <div class="column is-6 is-offset-6"></div>
            </div>
          </div>
        </div>
      </section>
      <section id="parallax-2" class="hero is-large bg2">
        <section id="about">
          <div class="about-container">
            <div class="image-gallery">
              <div class="image-box">
                <img src={Iot1} alt="image" />
                <h2 class="iot">Gambar IoT 1</h2>
              </div>
              <div class="image-box">
                <img src={Iot2} alt="image" />
                <h2 class="iot">Gambar IoT 2</h2>
              </div>
              <div class="image-box">
                <img src={Iot3} alt="image" />
                <h2 class="iot">Gambar IoT 3</h2>
              </div>
              <div class="image-box">
                <img src={Iot4} alt="image" />
                <h2 class="iot">Gambar IoT 4</h2>
              </div>
            </div>
            <div class="about-desc">
              <div class="about-headers">Apa itu INTERNET OF ROOFTOP?</div>
              INTERNET OF ROOFTOP merupakan proyek atap Bergerak Otomatis yang bertujuan untuk memberikan solusi cerdas dalam mengelola atap, dengan fokus utama pada otomatisasi penutupan saat hujan atau malam hari. Konsep di balik proyek
              ini adalah memanfaatkan sensor hujan dan sensor cahaya untuk mengoptimalkan penggunaan atap, memberikan kenyamanan dan efisiensi energi.
            </div>
            <div class="about-tech">
              <div class="about-headers">komponen apa yang digunakan?</div>
              <li>ESP8266 NodeMCU: Sebagai mikrokontroler utama untuk mengendalikan perangkat dan menghubungkannya ke internet.</li>
              <li>Sensor Hujan dan Sensor Cahaya: Untuk mendeteksi kondisi cuaca dan keadaan lingkungan sekitar.</li>
              <li>Servo Motor: Digunakan untuk menggerakkan atap berdasarkan kondisi yang terdeteksi.</li>
              <li>Breadboard, Kabel Female to Male, dan Male to Male: Untuk menyusun sirkuit dengan rapi dan mudah diatur.</li>
              <li>Kabel USB dan Adapter: Untuk memberikan daya pada sistem</li>
            </div>
            <div class="about-how">
              <div class="about-headers">Cara kerja sistem?</div>
              Atap bergerak berinteraksi dengan lingkungan sekitarnya melalui sensor hujan dan sensor cahaya. Saat sensor hujan mendeteksi kelembapan yang tinggi atau sensor cahaya menunjukkan bahwa sudah malam, NodeMCU akan memberikan
              perintah kepada servo motor untuk menutup atap secara otomatis. Sebaliknya, jika kondisi cuaca baik, atap akan terbuka.
            </div>
            <div class="about-feature">
              <div class="about-headers">Fitur pada sistem?</div>
              <li>Otomatisasi Penuh: Atap bergerak merespons secara otomatis terhadap kondisi cuaca dan waktu hari.</li>
              <li>Pengendalian Jarak Jauh: Pantau dan kendalikan status atap melalui dashboard web.</li>
              <li>Manual Override: Matikan fungsi sensor dan kendalikan atap secara manual melalui antarmuka pengguna.</li>
            </div>
            <div class="about-web">
              <div class="about-headers">Yang dapat dilakukan/dilihat di dashboard?</div>
              Aplikasi web kami memberikan antarmuka yang intuitif dan mudah digunakan. Pengguna dapat melihat status atap (terbuka/tertutup) secara real-time, mengaktifkan atau menonaktifkan sensor otomatisasi, serta mengendalikan atap
              secara manual jika diperlukan.
            </div>
          </div>
        </section>
        {/* <!-- footerstructure --> */}
        <footer>Dibuat oleh Rosyid Ferdiansyah dan Daffa Muhammad I.</footer>
      </section>
    </div>
  );
}

export default LandingPage;

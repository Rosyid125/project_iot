import React from "react";
import "../aset/style.css";
import Iot1 from "../aset/img1.jpg";
import Iot2 from "../aset/img2.jpg";
import Iot3 from "../aset/img3.jpg";
import Iot4 from "../aset/img4.jpg";

function LandingPage() {
  return (
    <div className="body">
      <section id="parallax-1" class="hero is-large bg1 ">
        <nav className="nav-item">
          <h1 class="logo">
            <a href="/">IoT</a>
          </h1>
          <a href="/login" class="btn-sign-in">
            Sign In
          </a>
        </nav>
        <div class="header-title">Automatic Roof Controller</div>
        <div class="header-bottom">
          <p class="today-date">
            09 <span> /28</span>
          </p>
          <ul class="social-media">
            <li>
              <a href="">Youtube</a>
            </li>
            <li>
              <a href="">Instagram</a>
            </li>
            <li>
              <a href="">X</a>
            </li>
          </ul>
        </div>
        <div class="">
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
            <div class="about-info">
              Lorem ipsum dolor kontol sit amet consectetur adipisicing elit. Minima ex labore laborum pariatur odit ad dolores, exercitationem impedit culpa itaque error ab aliquid consequatur molestias minus ipsam dicta veritatis sequi.
            </div>
          </div>
        </section>
        {/* <!-- footerstructure --> */}
        <footer>
          Made with <i class="fa fa-heart"></i> by Rosyid and Daffa
        </footer>
        <div class="">
          <div class="container">
            <div class="columns">
              <div class="column is-6"></div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default LandingPage;

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AuthorImage from "../../images/author_thumbnail.jpg";
import nftImage from "../../images/nftImage.jpg";
import axios from "axios";
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
import OwlCarousel from 'react-owl-carousel';
import './HotCollections.css';
import AOS from "aos";
import "aos/dist/aos.css";

const owlOptions = {
  loop: true,
  margin: 10,
  nav: true,
  dots: false,
  responsive: {
    0: {
      items: 1,
    },
    576: {
      items: 2,
    },
    768: {
      items: 3,
    },
    992: {
      items: 4,
    },
    1200: {
      items: 4,
    },
  },
};

const HotCollections = () => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
     AOS.init({ once: true });
    const fetchCollections = async () => {
      try {
        const { data } = await axios.get(
          "https://us-central1-nft-cloud-functions.cloudfunctions.net/hotCollections"
        );
        setCollections(data.slice(0, 6)); 
      } catch (error) {
        console.error("Error fetching collections:", error);
        setCollections(new Array(4).fill({}));
      } finally {
        setLoading(false);
      }
    };

    fetchCollections();
  }, []);

  return (
    <section id="section-collections" className="no-bottom">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="text-center">
              <h2 data-aos-delay="100" data-aos="fade-in">Hot Collections</h2>
              <div className="small-border bg-color-2"></div>
            </div>
          </div>
        </div>


{loading ? (
  <div className="row">
    {new Array(4).fill(0).map((_, index) => (
      <div className="col-lg-3 col-md-6" key={index}>
        <div className="nft_coll">
          <div className="nft_wrap skeleton-box skeleton-shimmer" />
          <div className="nft_coll_pp">
            <div className="skeleton-circle skeleton-shimmer" />
            <i className="fa fa-check"></i>
          </div>
          <div className="nft_coll_info">
            <div className="skeleton-text skeleton-shimmer" style={{ width: '70%', height: '20px', marginBottom: '8px' }} />
            <div className="skeleton-text skeleton-shimmer" style={{ width: '40%', height: '16px' }} />
          </div>
        </div>
      </div>
    ))}
  </div>
) : (
  <OwlCarousel className="owl-theme"  data-aos-delay="100" data-aos="fade-in"{...owlOptions}>
    {collections.map((collection, index) => (
      <div className="item" key={collection.id || index}>
        <div className="nft_coll">
          <div className="nft_wrap">
            <Link to={`/item-details/${collection.nftId}`}>
              <img
                src={collection.nftImage || nftImage}
                className="lazy img-fluid"
                alt={collection.title || ""}
              />
            </Link>
          </div>
          <div className="nft_coll_pp">
            <Link to={`/author/${collection.authorId}`}>
              <img
                className="lazy pp-coll"
                src={collection.authorImage || AuthorImage}
                alt=""
              />
            </Link>
            <i className="fa fa-check"></i>
          </div>
          <div className="nft_coll_info">
            <Link to="/explore">
              <h4>{collection.title || "Pinky Ocean"}</h4>
            </Link>
            <span>ERC-{collection.code || "192"}</span>
          </div>
        </div>
      </div>
    ))}
  </OwlCarousel>
)}
      </div>
    </section>
  );
};

export default HotCollections;
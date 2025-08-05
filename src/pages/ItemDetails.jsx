import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import EthImage from "../images/ethereum.svg";
import { Link } from "react-router-dom";
import AuthorImage from "../images/author_thumbnail.jpg";
import nftImage from "../images/nftImage.jpg";
import "./ItemDetails.css"; 

const ItemDetails = () => {
  const { id } = useParams();
  const [collection, setCollection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchCollectionDetails = async () => {
      try {
        setLoading(true);

        const { data } = await axios.get('https://us-central1-nft-cloud-functions.cloudfunctions.net/hotCollections');
        const foundCollection = data.find(item => item.id.toString() === id);

        if (foundCollection) {
          setCollection(foundCollection);
        } else {
          setError('Collection not found');
        }
      } catch (err) {
        setError('Error fetching collection details');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCollectionDetails();
    }
  }, [id]);

  if (loading) {
    return (
      <div id="wrapper">
        <div className="no-bottom no-top" id="content">
          <div id="top"></div>
          <section aria-label="section" className="mt90 sm-mt-0">
            <div className="container">
              <div className="row">
                <div className="col-md-6 text-center">
                  <div className="skeleton-box skeleton-shimmer" style={{ width: "100%", height: "350px", borderRadius: "16px", marginBottom: "30px" }} />
                </div>
                <div className="col-md-6">
                  <div className="item_info">
                    <div className="skeleton-text skeleton-shimmer" style={{ width: "60%", height: "32px", marginBottom: "20px" }} />
                    <div className="item_info_counts" style={{ marginBottom: "16px" }}>
                      <div className="skeleton-text skeleton-shimmer" style={{ width: "40px", height: "20px", display: "inline-block", marginRight: "10px" }} />
                      <div className="skeleton-text skeleton-shimmer" style={{ width: "40px", height: "20px", display: "inline-block" }} />
                    </div>
                    <div className="skeleton-text skeleton-shimmer" style={{ width: "90%", height: "18px", marginBottom: "12px" }} />
                    <div className="d-flex flex-row">
                      <div className="mr40">
                        <h6>Owner</h6>
                        <div className="item_author">
                          <div className="author_list_pp">
                            <div className="skeleton-circle skeleton-shimmer" />
                          </div>
                          <div className="author_list_info">
                            <div className="skeleton-text skeleton-shimmer" style={{ width: "80px", height: "16px" }} />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="de_tab tab_simple">
                      <div className="de_tab_content">
                        <h6>Creator</h6>
                        <div className="item_author">
                          <div className="author_list_pp">
                            <div className="skeleton-circle skeleton-shimmer" />
                          </div>
                          <div className="author_list_info">
                            <div className="skeleton-text skeleton-shimmer" style={{ width: "80px", height: "16px" }} />
                          </div>
                        </div>
                      </div>
                      <div className="spacer-40"></div>
                      <h6>Price</h6>
                      <div className="nft-item-price">
                        <div className="skeleton-box skeleton-shimmer" style={{ width: "60px", height: "24px", borderRadius: "8px" }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div id="wrapper">
        <div className="no-bottom no-top" id="content">
          <div id="top"></div>
          <section aria-label="section" className="mt90 sm-mt-0">
            <div className="container">
              <div className="row">
                <div className="col-md-12 text-center">
                  <h2>Error: {error}</h2>
                  <Link to="/" className="btn-main">Go Back Home</Link>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    );
  }

  return (
    <div id="wrapper">
      <div className="no-bottom no-top" id="content">
        <div id="top"></div>
        <section aria-label="section" className="mt90 sm-mt-0">
          <div className="container">
            <div className="row">
              <div className="col-md-6 text-center">
                <img
                  src={collection?.nftImage || nftImage}
                  className="img-fluid img-rounded mb-sm-30 nft-image"
                  alt={collection?.title || "NFT"}
                />
              </div>
              <div className="col-md-6">
                <div className="item_info">
                  <h2>{collection?.title || "Rainbow Style #194"}</h2>

                  <div className="item_info_counts">
                    <div className="item_info_views">
                      <i className="fa fa-eye"></i>
                      {collection?.code || 100}
                    </div>
                    <div className="item_info_like">
                      <i className="fa fa-heart"></i>
                      74
                    </div>
                  </div>
                  <p>
                    Collection ID: {collection?.id} | NFT ID: {collection?.nftId} | 
                    A unique digital collectible from the {collection?.title} collection.
                  </p>
                  <div className="d-flex flex-row">
                    <div className="mr40">
                      <h6>Owner</h6>
                      <div className="item_author">
                        <div className="author_list_pp">
                          <Link to={`/author/${collection?.authorId}`}>
                            <img 
                              className="lazy" 
                              src={collection?.authorImage || AuthorImage} 
                              alt="" 
                            />
                            <i className="fa fa-check"></i>
                          </Link>
                        </div>
                        <div className="author_list_info">
                          <Link to={`/author/${collection?.authorId}`}>
                            Owner #{collection?.authorId || "Monica Lucas"}
                          </Link>
                        </div>
                      </div>
                    </div>
                    <div></div>
                  </div>
                  <div className="de_tab tab_simple">
                    <div className="de_tab_content">
                      <h6>Creator</h6>
                      <div className="item_author">
                        <div className="author_list_pp">
                          <Link to={`/author/${collection?.authorId}`}>
                            <img 
                              className="lazy" 
                              src={collection?.authorImage || AuthorImage} 
                              alt="" 
                            />
                            <i className="fa fa-check"></i>
                          </Link>
                        </div>
                        <div className="author_list_info">
                          <Link to={`/author/${collection?.authorId}`}>
                            Creator #{collection?.authorId || "Monica Lucas"}
                          </Link>
                        </div>
                      </div>
                    </div>
                    <div className="spacer-40"></div>
                    <h6>Price</h6>
                    <div className="nft-item-price">
                      <img src={EthImage} alt="" />
                      <span>{(collection?.code / 100) || 1.85}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ItemDetails;
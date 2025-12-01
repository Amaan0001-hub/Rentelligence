// BroadcastChannel
"use client";

import Image from "next/image";
import { use, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { getByIdProduct } from "@/app/redux/slices/productSlice";
import { getAllProductImageForUser } from "@/app/redux/slices/productSlice";
import Loader from "@/app/components/Loader";
import { useRouter } from "next/navigation";
import LeaseModal from "@/app/components/LeaseModal";
import { X } from "react-feather";

export default function AgentDetail({ params }) {
  const { id: productId } = use(params);
  const router = useRouter();
  const dispatch = useDispatch();
  const [mainImage, setMainImage] = useState(null);
  const [thumbnailImages, setThumbnailImages] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const { getAllProductImageForUserData } = useSelector(
    (state) => state.product
  );
  const { similarProduct, productDetail } =
    useSelector((state) => state.product.getByIdProductData) || {};

  const [showLeaseModal, setShowLeaseModal] = useState(false);

  useEffect(() => {
    if (productId) {
      const data = {
        id: String(productId),
      };
      dispatch(getByIdProduct(data));
    }
  }, [dispatch, productId]);

  const handleClick = (productId) => {
    router.push(`/pages/browser-agents/agent-detail/${productId}`);
  };

  const handleThumbnailHover = (image) => {
    setMainImage(image);
  };

  useEffect(() => {
    if (productDetail?.imageUrls?.length > 0) {
      setMainImage(productDetail.imageUrls[0]);
      const uniqueImages = new Set();
      productDetail.imageUrls.forEach((img) => {
        uniqueImages.add(img);
      });
      if (getAllProductImageForUserData?.length > 0) {
        getAllProductImageForUserData.forEach((img) => {
          uniqueImages.add(img.imageUrl);
        });
      }
      setThumbnailImages(Array.from(uniqueImages));
    }
  }, [productDetail, getAllProductImageForUserData]);

  useEffect(() => {
    if (productDetail && productId) {
      dispatch(getAllProductImageForUser(`${productDetail?.productId}`));
    }
  }, [productDetail, productId]);

  const handleAddToCartClick = () => {
    setShowLeaseModal(true);
  };

  const isOutOfStock = productDetail?.stock === 0 <= 0;
  function parseSpecification(htmlString) {
    let clean = htmlString.replace(/<\/?p>/g, "");

    let lines = clean.split(/<br\s*\/?/).filter(Boolean);

    return lines
      .map((line) => {
        const match = line.match(/<strong>(.*?)\s*:\s*<\/strong>\s*(.*)/);
        if (match) {
          return { label: match[1].trim(), value: match[2].trim() };
        }
        return null;
      })
      .filter(Boolean);
  }

  const handleBuyClick = (e, agent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowBuyModal(true);
    setSelectedAgent(productDetail);
  };

  return (
    <>
      {showLeaseModal && (
        <LeaseModal
          agent={{
            name: productDetail?.productName,
          }}
          onClose={() => setShowLeaseModal(false)}
          month={productDetail?.toatalmonth}
          price={productDetail?.price}
          productId={productDetail?.productId}
          rate={productDetail?.energyRate}
          unit={productDetail?.unit}
          totalReturn={productDetail?.totalReturn}
          image={productDetail?.imageUrls?.[0] || "/fallback-image.jpg"}
          name={productDetail?.productName}
          weeklyReturn={productDetail?.weeklyReturn}
        />
      )}
      <div className="flex flex-col justify-around gap-4 p-8 lg:flex-row lg:gap-28 ">
        <div className="w-full lg:w-1/2">
          <div className="flex justify-center mb-4">
            {mainImage ? (
              <img
                src={mainImage}
                alt={productDetail?.productName}
                width={400}
                height={400}
                className="rounded-lg shadow-lg mt-5 max-w-full object-contain h-[200px]"
              />
            ) : (
              <div className="w-full h-[400px] bg-gray-200 flex items-center justify-center rounded-lg mt-5">
                <span className="text-gray-500">
                  <Loader />
                </span>
              </div>
            )}
          </div>

          <div className="flex flex-wrap justify-center gap-2 mt-4">
            {thumbnailImages?.map((image, index) => (
              <div
                key={index}
                className={`w-16 h-16 border-2 rounded-md cursor-pointer ${
                  mainImage === image ? "border-blue-500" : "border-transparent"
                }`}
                onMouseEnter={() => handleThumbnailHover(image)}
              >
                <img
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  width={64}
                  height={64}
                  className="object-cover w-full h-full rounded-md"
                />
              </div>
            ))}
          </div>

          {isOutOfStock ? (
            <button
              disabled
              className="w-full p-2 mt-6 text-white bg-red-500 rounded-md cursor-not-allowed"
            >
              Out of Stock
            </button>
          ) : (
            <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
              <button
                className="flex-1 w-full p-2 mt-6 text-white transition-colors rounded-md cursor-pointer sm:w-auto th-btn style2"
                onClick={handleBuyClick}
              >
                Buy Agent
              </button>
              <button
                className="flex-1 w-full p-2 mt-6 text-white transition-colors rounded-md cursor-pointer sm:w-auto th-btn style2"
                onClick={handleAddToCartClick}
              >
                Lease Agent
              </button>
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="w-full mt-6 lg:mt-0">
          <div className="p-4">
            <h2 className="mb-2 text-xl font-bold md:text-2xl">
              {productDetail?.productName}
            </h2>
            <p className="mb-2 text-md md:text-md">{productDetail?.subName}</p>
            <p className="text-lg text-gray-700 dark:text-white">
              {productDetail?.description}
            </p>
            <div className="flex items-center justify-start my-1">
              {[1, 2, 3, 4, 5]?.map((star) => (
                <svg
                  key={star}
                  className={`w-4 h-4 md:w-5 md:h-5 ${
                    star <= Math.round(productDetail?.rating)
                      ? "text-yellow-400"
                      : "text-gray-300"
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <div className="flex items-center space-x-2 text-lg font-bold">
              <span className="text-black dark:text-white">
                $ {productDetail?.price}
              </span>
            </div>
            {/* Seller Info */}
            <div className="pt-4 mt-4 border-t">
              <h3 className="text-lg font-bold">Owned By </h3>
              <p className="mt-2"> {productDetail?.sellerName}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Similar Products Section */}
      <div className="px-8 mb-10 ">
        <h3 className="mb-6 text-2xl font-bold ">Similar Agents</h3>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 ">
          {similarProduct?.map((product) => (
            <div
              key={product.similarProductId}
              onClick={() => handleClick(product.id, product.productName)}
              className="p-4 transition-shadow border rounded-lg cursor-pointer hover:shadow-md"
            >
              {product?.images?.slice(0, 1)?.map((img, idx) => (
                <div className="flex justify-center mb-4" key={idx}>
                  <img
                    key={img.similarProductId}
                    src={img}
                    alt={product.productName}
                    width={150}
                    height={150}
                    className="mb-2 rounded-lg"
                  />
                </div>
              ))}
              <h4 className="mb-2 font-medium text-gray-800 dark:text-white">
                {product.productName}
              </h4>
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-start gap-2">
                  <p className="text-base font-semibold text-black md:text-xl dark:text-white">
                    $ {product?.price}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Specifications Section */}
      {productDetail?.specification && (
        <div className="px-8 mb-10">
          <h3 className="mb-6 text-2xl font-semibold">Specifications</h3>
          <div className="p-6 text-gray-800 bg-white rounded-lg shadow-md">
            <div className="divide-y">
              <div
                className="specification-table"
                style={{ width: "100%" }}
                dangerouslySetInnerHTML={{
                  __html: productDetail.specification,
                }}
              />

              <style jsx>{`
                .specification-table p {
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                  padding: 0.75rem 0;
                  border-bottom: 1px solid #e5e7eb;
                  margin: 0;
                  font-size: 1rem;
                }
                .specification-table strong {
                  min-width: 200px;
                  font-weight: 500;
                  color: #374151;
                }
              `}</style>
            </div>
          </div>
        </div>
      )}

      {showBuyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative w-full max-w-md p-6 mx-4 bg-white dark:bg-gray-800 rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-700 dark:text-white">
                {selectedAgent?.productName || "Product Not Available"}
              </h3>
              <button
                onClick={() => setShowBuyModal(false)}
                className="p-1 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                aria-label="Close modal"
              >
                <X className="w-5 h-5 text-gray-900 dark:text-white" />
              </button>
            </div>

            <div className="p-6 mb-6 border-l-4 border-red-400 rounded-lg bg-gradient-to-r from-red-50 to-orange-50">
              <div className="flex items-start space-x-3">
                <div>
                  <h4 className="mb-2 font-bold text-red-800">
                    Currently Not Available for Purchase
                  </h4>
                  <p className="mb-3 text-red-700">
                    This AI agent is an exclusive NFT owned by a verified
                    collector. However, you can lease it for use in your region
                    through our secure leasing platform.
                  </p>
                  <div className="p-3 rounded-lg bg-white/70">
                    <div className="mb-1 text-sm font-medium text-gray-800">
                      Regional Lease Available:
                    </div>
                    <div className="text-sm text-gray-700">
                      • Full agent functionality access
                    </div>
                    <div className="text-sm text-gray-700">
                      • 24/7 technical support included
                    </div>
                    <div className="text-sm text-gray-700">
                      • Cancel anytime with 7-day notice
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-center mt-6">
              <button
                onClick={() => {
                  setShowBuyModal(false);
                  setShowLeaseModal(true);
                }}
                className="px-4 py-2 bg-[#63f] text-white rounded-lg"
              >
                Lease For your Region
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// "use client";
// import Marquee from "react-fast-marquee";
// import { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { getNews } from "../../redux/slices/authSlice";


// export default function OfferStrip() {
//   const dispatch = useDispatch();
//   const { newsData, loading, } = useSelector((state) => state.auth);

//   const repeatedNews = newsData?.data ? [...newsData.data, ...newsData.data ,...newsData.data] : [];

//   useEffect(() => {
//     dispatch(getNews({newsId: "2"}));
//   }, [dispatch]);

//   return (
//     <div className="w-full px-2 py-2 md:py-2 md:px-3 ">
//       <div className="container px-2 mx-auto md:px-4">
//         {loading && <p className="text-center">Loading news...</p>}
//         <Marquee
//           speed={50}
//           gradient={false}
//           pauseOnHover={true}
//           className="overflow-hidden"
//         >
//           {repeatedNews.map((offer, idx) => (
//             <div
//               key={idx}
//               className="inline-block mx-2 md:mx-6"
//             >
//               <div className="inline-block text-black dark:text-white" dangerouslySetInnerHTML={{ __html: offer.news }} />
//             </div>
//           ))}
//         </Marquee>
//       </div>
//     </div>
//   );
// }

"use client";
import Marquee from "react-fast-marquee";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getNews } from "../../redux/slices/authSlice";
import { MdOutlineCampaign } from "react-icons/md";
import Link from "next/link";

export default function OfferStrip() {
  const dispatch = useDispatch();
  const { newsData, loading } = useSelector((state) => state.auth);

  const repeatedNews = newsData?.data
    ? [...newsData.data, ...newsData.data, ...newsData.data]
    : [];

  useEffect(() => {
    dispatch(getNews({ newsId: "2" }));
  }, [dispatch]);

  return (
    <div className="w-full px-2 py-2 md:py-2 md:px-3 ">
      <div className="container px-2 mx-auto md:px-4">
        {loading && <p className="text-center">Loading news...</p>}
        <Marquee
          speed={50}
          gradient={false}
          pauseOnHover={true}
          className="overflow-hidden"
        >
          {repeatedNews.map((offer, idx) => (
  <div
    key={idx}
    className="flex items-center gap-2 mx-2 md:mx-6"
  >
    {/* News Icon */}
    <MdOutlineCampaign className="text-xl text-red-600 animate-pulse" />

    {/* Clickable News Content */}
    <Link
      href="/pages/ai-tools"
      className="inline-block text-sm font-semibold text-gray-600 transition-colors dark:text-white hover:text-blue-600"
      style={{ fontFamily: "Geist" }}
    >
      <span dangerouslySetInnerHTML={{ __html: offer.news }} />
    </Link>
  </div>
))}
        </Marquee>
      </div>
    </div>
  );
}

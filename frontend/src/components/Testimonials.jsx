import React, { useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useUser } from "@clerk/clerk-react";
import { ShopContext } from "../contexts/ShopContext";
import { toast } from "../utils/toast";

const Testimonials = () => {
  const { backendUrl, guestId, token } = useContext(ShopContext);
  const { user } = useUser();

  const [reviews, setReviews] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    rating: 5,
    comment: "",
  });

  const loadReviews = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/reviews`);
      if (response.data.success) {
        setReviews(response.data.reviews || []);
      }
    } catch (error) {
      toast.error("Failed to load reviews");
    }
  };

  useEffect(() => {
    loadReviews();
  }, [backendUrl]);

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: prev.name || user.fullName || user.firstName || "",
      }));
    }
  }, [user]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 3 >= reviews.length ? 0 : prev + 3));
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 3 < 0 ? Math.max(reviews.length - 3, 0) : prev - 3));
  };

  useEffect(() => {
    if (!isMobile || reviews.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1 >= reviews.length ? 0 : prev + 1));
    }, 3000);

    return () => clearInterval(interval);
  }, [isMobile, reviews.length]);

  const displayedReviews = useMemo(
    () => reviews.slice(currentIndex, isMobile ? currentIndex + 1 : currentIndex + 3),
    [reviews, currentIndex, isMobile]
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.comment.trim()) {
      toast.warning("Please fill name and comment");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        name: formData.name.trim(),
        rating: Number(formData.rating),
        comment: formData.comment.trim(),
        userId: user?.id,
        guestId,
      };

      const response = await axios.post(
        `${backendUrl}/api/reviews`,
        payload,
        token ? { headers: { token } } : {}
      );

      if (response.data.success) {
        toast.success("Review submitted successfully");
        setFormData((prev) => ({ ...prev, comment: "", rating: 5 }));
        await loadReviews();
      } else {
        toast.error(response.data.message || "Could not submit review");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not submit review");
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
      <>
          <style>
              {`
                  @import url("https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap");
                  *{
                      font-family: "Poppins", sans-serif;
                  }`
              }
          </style>
          <section className='bg-transparent py-20 px-4 sm:px-6 lg:px-8'>
              <div className='w-full max-w-6xl mx-auto'>
                  <h1 className='text-gray-600 font-medium text-4xl md:text-[40px] text-center md:text-left'>Loved by 10k+ People</h1>
                  <p className='text-gray-600 text-sm/6 mt-4 max-w-96 text-center md:text-left mx-auto md:mx-0'>Every single testimonial is a testament to the profound impact we strive to create every single day.</p>

                  <form
                    onSubmit={handleReviewSubmit}
                    className="mt-8 bg-white/70 border border-gray-200 rounded-2xl p-5 shadow-sm"
                  >
                    <p className="text-base font-semibold text-gray-700 mb-3">Share Your Review</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Your name"
                        className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none"
                        required
                      />
                      <select
                        name="rating"
                        value={formData.rating}
                        onChange={handleChange}
                        className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none"
                      >
                        {[5, 4, 3, 2, 1].map((r) => (
                          <option key={r} value={r}>{r} Stars</option>
                        ))}
                      </select>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-black text-white rounded-lg px-4 py-2 text-sm disabled:opacity-60"
                      >
                        {isSubmitting ? "Submitting..." : "Submit Review"}
                      </button>
                    </div>
                    <textarea
                      name="comment"
                      value={formData.comment}
                      onChange={handleChange}
                      rows={3}
                      placeholder="Write your feedback..."
                      className="mt-3 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none"
                      required
                    />
                  </form>

                  <div className='hidden md:flex justify-end gap-2 mt-4'>
                      <div onClick={handlePrev} className='h-10 w-10 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center cursor-pointer hover:bg-neutral-800 transition-all text-white'>
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-left-icon lucide-arrow-left"><path d="m12 19-7-7 7-7" /><path d="M19 12H5" /></svg>
                      </div>
                      <div onClick={handleNext} className='h-10 w-10 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center cursor-pointer hover:bg-neutral-800 transition-all text-white'>
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-right-icon lucide-arrow-right"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                      </div>
                  </div>

                  <div className='mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-8 md:px-0 mt-12 md:mt-6'>

                      {displayedReviews.map((item) => (
                          <div key={item._id} className='bg-neutral-800 hover:-translate-y-1 transition duration-300 border border-neutral-800 rounded-2xl p-6 space-y-6'>
                              <div className='flex items-start justify-between'>
                                  <div className="flex">
                                      {Array(5).fill(0).map((_, i) => (
                                          <svg key={i} xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                                              className={`lucide lucide-star ${i < Number(item.rating || 0) ? "text-transparent fill-[#FF8F20]" : "text-gray-500 fill-transparent"}`} aria-hidden="true">
                                              <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path>
                                          </svg>
                                      ))}
                                  </div>
                                  <p className='text-xs text-gray-400'>{new Date(item.createdAt).toDateString()}</p>
                              </div>

                              <p className='text-sm/6 text-gray-500'>{item.comment}</p>
                              <div className='flex flex-col md:flex-row items-center gap-4 mt-4'>
                                  <div className='w-13 h-13 rounded-full bg-gray-700 text-white flex items-center justify-center text-lg font-semibold'>
                                    {(item.name || "U").charAt(0).toUpperCase()}
                                  </div>
                                  <div className="flex flex-col items-start justify-start gap-1">
                                      <p className='text-sm text-gray-400'>{item.name}</p>  
                                      <p className='text-xs font-medium text-gray-500'>{item.isGuest ? "Guest User" : "Verified User"}</p>
                                  </div>
                              </div>
                          </div>
                      ))}
                  </div>
                  <div className="hidden max-md:flex items-center justify-center mt-5 space-x-2">
                      {reviews.map((_, index) => (
                          <span onClick={() => setCurrentIndex(index)} key={index}
                              className={`w-3 h-3 rounded-full transition-all ${index === currentIndex
                                  ? "bg-gray-600"
                                  : "bg-gray-600/20"
                                  }`}
                          ></span>
                      ))}
                  </div>
              </div>
          </section>
      </>
  )
}

export default Testimonials;
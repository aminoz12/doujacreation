'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Star } from 'lucide-react'

const testimonials = [
  {
    id: 1,
    name: 'Mena G.',
    comment: 'The dress was stunning! Very good materials, colors and vestibility. And the team was very helpful and fast with all my doubts.',
    rating: 5
  }
]

const clientImages = [
  '/cat1.png',
  '/cat2.png',
  '/cat3.png',
  '/cat4.png',
  '/cat5.png',
];

export default function TestimonialsSection() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const goToPreviousImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? clientImages.length - 1 : prevIndex - 1
    );
  };

  const goToNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % clientImages.length);
  };

  const goToImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  const currentTestimonial = testimonials[0];

  return (
    <section className="section-padding bg-luxury-ivory">
      <div className="container-luxury">
        {/* Title */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="font-serif text-2xl md:text-3xl mb-4 text-luxury-black uppercase tracking-wide">
            NOS CLIENTS
          </h2>
          <div className="w-24 h-0.5 bg-gold-imperial mx-auto" />
        </motion.div>

        {/* Testimonial Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
          {/* Left Side - Image Carousel */}
          <motion.div
            className="order-1 lg:order-1 relative lg:scale-250"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="grid grid-cols-4 gap-3">
              {clientImages.slice(0, 4).map((image, index) => (
                <div
                  key={index}
                  className={`relative aspect-[1/3] overflow-hidden bg-luxury-white transition-all duration-300 ${
                    index === currentImageIndex 
                      ? 'ring-2 ring-gold-imperial scale-105' 
                      : 'opacity-70 hover:opacity-100'
                  }`}
                >
                  <Image
                    src={image}
                    alt={`Client ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 20vw, 18vw"
                  />
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right Side - Testimonial Text */}
          <motion.div
            className="order-2 lg:order-2 relative lg:max-w-md"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            {/* Navigation Arrows */}
            <button
              onClick={goToPreviousImage}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 bg-luxury-white/90 hover:bg-luxury-white text-luxury-black p-2 rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-10"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={goToNextImage}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 bg-luxury-white/90 hover:bg-luxury-white text-luxury-black p-2 rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-10"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Testimonial Card */}
            <div className="bg-luxury-white p-6 md:p-8 relative">
              {/* Large Quote Mark */}
              <div className="absolute top-2 left-2 text-4xl md:text-6xl text-gold-imperial/20 font-serif">
                "
              </div>

              {/* Stars */}
              <div className="flex mb-6">
                {[...Array(currentTestimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-gold-imperial fill-current" />
                ))}
              </div>

              {/* Comment */}
              <p className="font-sans text-base md:text-lg text-luxury-black/70 leading-relaxed mb-6">
                {currentTestimonial.comment}
              </p>

              {/* Client Name */}
              <div>
                <p className="font-serif text-lg md:text-xl text-luxury-black">
                  {currentTestimonial.name}
                </p>
              </div>
            </div>

            {/* Navigation Dots */}
            <div className="flex justify-center mt-8 space-x-2">
              {clientImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToImage(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentImageIndex 
                      ? 'bg-gold-imperial w-8' 
                      : 'bg-luxury-black/30 hover:bg-luxury-black/50'
                  }`}
                />
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}


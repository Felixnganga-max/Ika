import React from "react";
import { motion } from "framer-motion";

const AboutUs = () => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const teamMembers = [
    {
      name: "Sarah Omondi",
      title: "Head Chef",
      image: "/api/placeholder/300/300",
      bio: "With 15 years of experience in traditional Kenyan cuisine, Sarah brings authentic flavors to every dish."
    },
    {
      name: "James Mwangi",
      title: "Founder & CEO",
      image: "/api/placeholder/300/300",
      bio: "James founded IkaFastFoods with a vision to share Kenya's rich culinary heritage in a modern, accessible way."
    },
    {
      name: "Amina Hassan",
      title: "Customer Experience Manager",
      image: "/api/placeholder/300/300",
      bio: "Amina ensures every customer feels like family from the moment they walk through our doors."
    }
  ];

  return (
    <div className="bg-gradient-to-b from-[#FFF5E6] to-white min-h-screen pt-20">
      {/* Hero Section */}
      <div className="relative h-[50vh] overflow-hidden">
        {/* Hero Image */}
        <div className="absolute inset-0">
          <img 
            src="/api/placeholder/1600/900" 
            alt="Kenyan street food market" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#800020]/80 to-black/50"></div>
        </div>

        {/* Hero Content */}
        <div className="relative container mx-auto px-4 h-full flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-2xl text-white"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">Our <span className="text-[#FFD700]">Story</span></h1>
            <div className="w-20 h-1 bg-[#FFD700] mb-6"></div>
            <p className="text-xl md:text-2xl mb-8">Bringing authentic Kenyan flavors to your neighborhood since 2015.</p>
          </motion.div>
        </div>
      </div>

      {/* Our Story Section */}
      <motion.section 
        className="py-16 md:py-24 container mx-auto px-4"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div variants={itemVariants} className="order-2 lg:order-1">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-[#800020]">From Street Food to Sensation</h2>
            <p className="text-gray-700 mb-4">
              IkaFastFoods began as a humble street cart in Nairobi, where our founder James would serve his grandmother's 
              recipes to hungry office workers and students. The authentic flavors and generous portions quickly gained a following.
            </p>
            <p className="text-gray-700 mb-4">
              As word spread about our delicious, affordable Kenyan fast food, we opened our first brick-and-mortar location in 2017. 
              Today, we've grown to five locations across Kenya, each maintaining the same commitment to quality, flavor, and heritage.
            </p>
            <p className="text-gray-700 mb-6">
              Our menu blends traditional Kenyan comfort foods with modern fast-food convenience, creating an experience that celebrates 
              our culture while meeting the needs of today's busy customers.
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="bg-[#FFF5E6] p-4 rounded-lg shadow-md">
                <h3 className="font-bold text-[#800020] text-xl mb-2">5+</h3>
                <p className="text-sm text-gray-600">Locations</p>
              </div>
              <div className="bg-[#FFF5E6] p-4 rounded-lg shadow-md">
                <h3 className="font-bold text-[#800020] text-xl mb-2">25k+</h3>
                <p className="text-sm text-gray-600">Happy Customers</p>
              </div>
              <div className="bg-[#FFF5E6] p-4 rounded-lg shadow-md">
                <h3 className="font-bold text-[#800020] text-xl mb-2">30+</h3>
                <p className="text-sm text-gray-600">Menu Items</p>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            variants={itemVariants}
            className="order-1 lg:order-2 relative"
          >
            <div className="relative z-10 rounded-xl overflow-hidden shadow-xl transform rotate-3 hover:rotate-0 transition-all duration-500">
              <img 
                src="/api/placeholder/600/800" 
                alt="IkaFastFoods first location" 
                className="w-full h-auto object-cover"
              />
            </div>
            <div className="absolute top-1/2 right-1/2 transform translate-x-1/4 -translate-y-1/4 -z-10 w-64 h-64 rounded-full bg-[#FFD700]/20 blur-3xl"></div>
          </motion.div>
        </div>
      </motion.section>

      {/* Our Kenyan Heritage */}
      <section className="bg-[#800020]/5 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center max-w-3xl mx-auto mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#800020]">Our Kenyan Heritage</h2>
            <p className="text-gray-700">
              We take pride in showcasing Kenya's diverse culinary traditions through our menu, 
              featuring both traditional favorites and creative fusion dishes.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Signature Dish 1 */}
            <motion.div 
              className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
              whileHover={{ y: -10 }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="h-56 overflow-hidden">
                <img 
                  src="/api/placeholder/400/300" 
                  alt="Nyama Choma and Ugali" 
                  className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 text-[#800020]">Nyama Choma & Ugali</h3>
                <p className="text-gray-600 mb-4">
                  Our signature grilled meat served with traditional cornmeal ugali and kachumbari salad.
                </p>
                <div className="flex items-center text-sm text-gray-500">
                  <span className="bg-[#FFD700]/20 text-[#800020] px-3 py-1 rounded-full font-medium">Best Seller</span>
                </div>
              </div>
            </motion.div>

            {/* Signature Dish 2 */}
            <motion.div 
              className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
              whileHover={{ y: -10 }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="h-56 overflow-hidden">
                <img 
                  src="/api/placeholder/400/300" 
                  alt="Chapati Wrap" 
                  className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 text-[#800020]">Chapati Wraps</h3>
                <p className="text-gray-600 mb-4">
                  Freshly made chapati filled with seasoned beef, chicken, or beans and topped with kachumbari.
                </p>
                <div className="flex items-center text-sm text-gray-500">
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full font-medium">Quick Meal</span>
                </div>
              </div>
            </motion.div>

            {/* Signature Dish 3 */}
            <motion.div 
              className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
              whileHover={{ y: -10 }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="h-56 overflow-hidden">
                <img 
                  src="/api/placeholder/400/300" 
                  alt="Samosas" 
                  className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 text-[#800020]">Kenyan Samosas</h3>
                <p className="text-gray-600 mb-4">
                  Crispy triangular pastries filled with spiced beef, chicken, or vegetables, served with tangy tamarind sauce.
                </p>
                <div className="flex items-center text-sm text-gray-500">
                  <span className="bg-[#800020]/10 text-[#800020] px-3 py-1 rounded-full font-medium">Family Favorite</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <motion.section 
        className="py-16 md:py-24 container mx-auto px-4"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2 
            variants={itemVariants}
            className="text-3xl md:text-4xl font-bold mb-4 text-[#800020]"
          >
            Our Values
          </motion.h2>
          <motion.p variants={itemVariants} className="text-gray-700">
            At IkaFastFoods, we're guided by principles that keep us connected to our roots while looking toward the future.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Value 1 */}
          <motion.div 
            variants={itemVariants}
            className="bg-gradient-to-br from-white to-[#FFF5E6] p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-[#FFD700]/20"
          >
            <div className="w-16 h-16 bg-[#800020]/10 rounded-full flex items-center justify-center mb-6 mx-auto">
              <span className="text-2xl">🌍</span>
            </div>
            <h3 className="text-xl font-bold mb-4 text-center text-[#800020]">Community First</h3>
            <p className="text-gray-600 text-center">
              We source ingredients locally, hire from our neighborhoods, and give back through community initiatives.
            </p>
          </motion.div>

          {/* Value 2 */}
          <motion.div 
            variants={itemVariants}
            className="bg-gradient-to-br from-white to-[#FFF5E6] p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-[#FFD700]/20"
          >
            <div className="w-16 h-16 bg-[#800020]/10 rounded-full flex items-center justify-center mb-6 mx-auto">
              <span className="text-2xl">👨‍👩‍👧‍👦</span>
            </div>
            <h3 className="text-xl font-bold mb-4 text-center text-[#800020]">Family Heritage</h3>
            <p className="text-gray-600 text-center">
              Our recipes have been passed down through generations, preserving authentic Kenyan flavors and cooking techniques.
            </p>
          </motion.div>

          {/* Value 3 */}
          <motion.div 
            variants={itemVariants}
            className="bg-gradient-to-br from-white to-[#FFF5E6] p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-[#FFD700]/20"
          >
            <div className="w-16 h-16 bg-[#800020]/10 rounded-full flex items-center justify-center mb-6 mx-auto">
              <span className="text-2xl">🌱</span>
            </div>
            <h3 className="text-xl font-bold mb-4 text-center text-[#800020]">Sustainable Practices</h3>
            <p className="text-gray-600 text-center">
              We're committed to eco-friendly packaging, reducing food waste, and sustainable business practices.
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* Meet Our Team */}
      <section className="bg-[#800020]/5 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center max-w-3xl mx-auto mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#800020]">Meet Our Team</h2>
            <p className="text-gray-700">
              The passionate people behind your favorite Kenyan fast food experience.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div 
                key={member.name}
                className="bg-white rounded-xl overflow-hidden shadow-lg group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="h-64 overflow-hidden">
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6 relative">
                  <div className="absolute -top-10 right-6 w-20 h-20 bg-[#800020] rounded-full border-4 border-white overflow-hidden shadow-lg">
                    <img 
                      src={member.image} 
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-bold mb-1 text-[#800020]">{member.name}</h3>
                  <p className="text-[#FFD700] font-medium mb-4">{member.title}</p>
                  <p className="text-gray-600">{member.bio}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 md:py-24 container mx-auto px-4">
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#800020]">What Our Customers Say</h2>
          <p className="text-gray-700">
            Don't just take our word for it - hear from our satisfied customers.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Testimonial 1 */}
          <motion.div 
            className="bg-white p-6 rounded-xl shadow-lg relative"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-[#800020] text-6xl absolute -top-5 left-4 opacity-20">"</div>
            <p className="text-gray-600 mb-6 relative z-10">
              IkaFastFoods brings back memories of my grandmother's cooking. The chapati wraps are the perfect quick lunch, and their nyama choma is unmatched in Nairobi!
            </p>
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                <img src="/api/placeholder/100/100" alt="Customer" className="w-full h-full object-cover" />
              </div>
              <div>
                <h4 className="font-bold text-[#800020]">David Kamau</h4>
                <p className="text-sm text-gray-500">Regular Customer (3 years)</p>
              </div>
              <div className="ml-auto text-[#FFD700]">★★★★★</div>
            </div>
          </motion.div>

          {/* Testimonial 2 */}
          <motion.div 
            className="bg-white p-6 rounded-xl shadow-lg relative"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="text-[#800020] text-6xl absolute -top-5 left-4 opacity-20">"</div>
            <p className="text-gray-600 mb-6 relative z-10">
              As an expat living in Kenya, IkaFastFoods has introduced me to the amazing flavors of Kenyan cuisine in a way that feels approachable. Their staff is always friendly and helpful!
            </p>
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                <img src="/api/placeholder/100/100" alt="Customer" className="w-full h-full object-cover" />
              </div>
              <div>
                <h4 className="font-bold text-[#800020]">Emily Johnson</h4>
                <p className="text-sm text-gray-500">Regular Customer (1 year)</p>
              </div>
              <div className="ml-auto text-[#FFD700]">★★★★★</div>
            </div>
          </motion.div>

          {/* Testimonial 3 */}
          <motion.div 
            className="bg-white p-6 rounded-xl shadow-lg relative"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="text-[#800020] text-6xl absolute -top-5 left-4 opacity-20">"</div>
            <p className="text-gray-600 mb-6 relative z-10">
              I order catering from IkaFastFoods for all our office events. The samosas and mandazi are always a hit, and their delivery is always on time. Couldn't recommend them more!
            </p>
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                <img src="/api/placeholder/100/100" alt="Customer" className="w-full h-full object-cover" />
              </div>
              <div>
                <h4 className="font-bold text-[#800020]">Grace Wanjiku</h4>
                <p className="text-sm text-gray-500">Business Customer (2 years)</p>
              </div>
              <div className="ml-auto text-[#FFD700]">★★★★★</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Call to Action */}
      <motion.section 
        className="bg-gradient-to-r from-[#800020] to-[#600018] py-16 relative overflow-hidden"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          <div className="absolute top-20 right-20 w-64 h-64 bg-[#FFD700]/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 left-10 w-48 h-48 bg-white/5 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center text-white">
            <motion.h2 
              className="text-3xl md:text-4xl font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Taste the Authentic <span className="text-[#FFD700]">Kenyan Experience</span>
            </motion.h2>
            <motion.p 
              className="text-white/80 mb-8 text-lg"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Visit any of our locations or order online today. Your taste buds will thank you!
            </motion.p>
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <motion.button
                className="bg-[#FFD700] text-[#800020] font-bold py-3 px-8 rounded-full hover:bg-white transition-colors duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Order Online
              </motion.button>
              <motion.button
                className="bg-transparent border-2 border-white text-white font-bold py-3 px-8 rounded-full hover:bg-white/10 transition-colors duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Find a Location
              </motion.button>
            </motion.div>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default AboutUs;
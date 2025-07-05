import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaTwitter, FaGithub, FaLinkedin } from 'react-icons/fa'
import { MdEmail, MdLocationOn } from 'react-icons/md'

const Contact = () => {
  const handleSubmit = (e) => {
    e.preventDefault()
    // Here you could use axios to send the form data
    console.log('Form submitted!')
  }

  return (
    <div>
      <h1 className="flex items-center gap-2">
        <FaEnvelope />
        Contact Page
      </h1>
      <p>Get in touch with us!</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        <div>
          <h2>Contact Information</h2>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <MdEmail />
              <span>contact@example.com</span>
            </div>
            <div className="flex items-center gap-2">
              <FaPhone />
              <span>+1 (555) 123-4567</span>
            </div>
            <div className="flex items-center gap-2">
              <MdLocationOn />
              <span>123 Main St, City, State 12345</span>
            </div>
          </div>
          
          <h3 className="mt-8">Follow Us</h3>
          <div className="flex gap-4">
            <FaTwitter className="text-2xl text-blue-400 cursor-pointer hover:text-blue-500 transition-colors" />
            <FaGithub className="text-2xl text-gray-800 cursor-pointer hover:text-gray-900 transition-colors" />
            <FaLinkedin className="text-2xl text-blue-600 cursor-pointer hover:text-blue-700 transition-colors" />
          </div>
        </div>
        
        <div>
          <h2>Send us a message</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Your Name"
              className="p-2 rounded border border-gray-300 focus:border-blue-500 focus:outline-none"
            />
            <input
              type="email"
              placeholder="Your Email"
              className="p-2 rounded border border-gray-300 focus:border-blue-500 focus:outline-none"
            />
            <textarea
              placeholder="Your Message"
              rows="5"
              className="p-2 rounded border border-gray-300 focus:border-blue-500 focus:outline-none resize-y"
            />
            <button type="submit" className="p-3 rounded bg-blue-500 text-white hover:bg-blue-600 transition-colors cursor-pointer">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Contact

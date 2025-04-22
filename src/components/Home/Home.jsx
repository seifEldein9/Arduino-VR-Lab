import React, {  useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, PresentationControls } from "@react-three/drei";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import "./Home.css";
import "react-toastify/dist/ReactToastify.css";
function Model(props) {
  const { scene } = useGLTF("/earth.glb"); 
  const ref = useRef();
  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.y += 0.01; 
    }
  });

  return <primitive ref={ref} object={scene} {...props} />;
}
function Home() {
  return (
    <div className="home-container">
      <Navbar />
<div className="courses-section2">
      <h1>Arduino VR Lab</h1>
  
      <button className="download-button">Download (LST)</button>
      <p>
        <p>The Arduino VR Lab project aims to create an electronics lab simulator that uses Arduino platforms to provide an environment that is Interactive and educational.</p>
        <p>In this virtual lab, users will be able to build and connect Electronic Circuits using an interactive interface, giving them a practical and direct educational experience without the need for components.</p>
        <p>This project enables users to control sensors and electronic actuators, and experiment with programming modules Arduino, and explore how electronic systems work safely and comfortably. Arduino VR Lab represents a step towards integrating technology into engineering education and training, where it enhances practical understanding and develops programming skills And control electronic systems effectively.</p>

      </p>
      </div>
      
      <div className="left-section" style={{ width: "100%", height: "600px", position: "relative" }}>
      <Canvas
  dpr={[1, 2]}
  shadows
  camera={{ fov: 45 }}
  style={{ position: "absolute", width: "100%", height: "90%" , left: "300px"}}
  gl={{ alpha: true }}  
>

  <ambientLight intensity={0.5} />
  <directionalLight position={[2, 2, 2]} intensity={1} />

  <PresentationControls speed={0.5} polar={[-0.1, Math.PI / 4]}>
  <Model scale={1.5} />
  </PresentationControls>
</Canvas>

      </div>
      <div className="video-text-container">
      <div className="video-container"  >
  <img 
    src={require("../../Assets/imgs/WhatsApp Image 2025-02-04 at 4.56.11 AM.jpeg")} 
    alt="Meta Quest 3 Preview" 
    width="100%" 
    height="500px" 
   
  />
</div>
  <div className="text-container">
      <h2>Arduino VR Lab</h2>
      <p>
      The Arduino VR Lab project aims to create an electronics 
lab simulator that uses Arduino platforms to provide an 
environment that is Interactive and educational. 
In this virtual lab, users will be able to build and connect 
Electronic Circuits using an interactive interface, giving 
them a practical and direct educational experience 
without the need for components.
This project enables users to control sensors and 
electronic actuators, and experiment with programming 
modules Arduino, and explore how electronic systems 
work safely and comfortably. Arduino VR Lab represents 
a step towards integrating technology into engineering 
education and training, where it enhances practical 
understanding and develops programming skills And 
control electronic systems effectively.       </p>
    </div>
   

  
  </div>
  <div className="video-text-container">
  
<div className="text-container">
    <h2>Work environment</h2>
    <p>
    The Arduino VR Lab project operates in a virtual environment designed to simulate an interactive electronics lab. This environment is structured to provide users with an engaging and practical learning experience without the need for physical components.     </p>
  </div>
  <div className="video-container">
    <video width="100%" height="315" autoPlay muted loop>
      <source src={require("./../../Assets/video/document_5841425340995474443 (1).mp4")} type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  </div>

</div>
  <h2 style={{fontSize: "40px"}}>Platform</h2>
      <div className="video-text-container">
  <div className="video-container">
    <video width="100%" height="315" autoPlay muted loop>
      <source src={require("./../../Assets/video/Introducing Oculus Quest 2.mp4")} type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  </div>

  <div className="text-container">
    <h2>About Oculus Quest 2</h2>
    <p>
    Oculus Quest 2 is an advanced all-in-one VR system. It provides an immersive virtual reality experience with enhanced performance and a sleek design. Equipped with a high-resolution display, improved processing power, and ergonomic controllers, it ensures smooth and responsive interactions. The headset supports a wide range of VR applications, including gaming, fitness, and social experiences. With inside-out tracking, wireless freedom, and access to the Meta Quest Store, users can explore vast virtual worlds without needing an external PC or console.   </p>
  </div>
</div>

<div className="video-text-container">
  
<div className="text-container">
    <h2>About Oculus Quest 3</h2>
    <p>
    Oculus Quest 3 is an advanced all-in-one VR system. It provides an immersive virtual reality experience with enhanced performance and a sleek design. Featuring improved graphics, a higher resolution display, and a more comfortable fit, it enhances both gaming and productivity applications. With upgraded tracking, intuitive hand controls, and a vast library of VR content, it delivers a seamless and engaging user experience. The device supports wireless gameplay, cloud-based processing, and mixed reality features, making it a versatile choice for VR enthusiasts and professionals alike.     </p>
  </div>
  <div className="video-container">
    <video width="100%" height="315" autoPlay muted loop>
      <source src={require("./../../Assets/video/This is Meta Quest 3.mp4")} type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  </div>

</div>
      <div className="ret courses-section">
  <h1>Courses</h1>
  <p>
    Explore the world of Arduino VR Lab by joining our courses. These courses will help you deepen your knowledge of the project and learn valuable skills for building and connecting electronic circuits.
  </p>
  <div className="courses-container">
    <div className="course">
      <img src={require("./../../Assets/imgs/Learn Python for Beginners.png")} alt="Quantum Computing Course" />
      <a href="https://www.youtube.com/@visiontechVR" target="_blank" rel="noopener noreferrer">
        <button>Watch Now</button>
      </a>
    </div>
 
  </div>
</div>
<Footer />

    </div>
  );
}

export default Home;

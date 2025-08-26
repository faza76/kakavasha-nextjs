"use client";
import "./index.css";
import { useRef, useState, useEffect } from "react";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import CustomEase from "gsap/CustomEase";
import { ScrollTrigger } from "gsap/ScrollTrigger"; 
import { useTransitionRouter } from "next-view-transitions";

import VideoPlayer from "@/components/VideoPlayer/VideoPlayer";

gsap.registerPlugin(CustomEase, ScrollTrigger);
CustomEase.create("hop", ".15, 1, .25, 1");
CustomEase.create("hop2", ".9, 0, .1, 1");

let isInitialLoad = true;

export default function Home() {
  const router = useTransitionRouter();
  const [isAnimating, setIsAnimating] = useState(false);
  // const isCartOpen = useCartStore((state) => state.isCartOpen);
  const container = useRef(null);
  const counterRef = useRef(null);
  const [showPreloader, setShowPreloader] = useState(isInitialLoad);



  useEffect(() => {
    return () => {
      isInitialLoad = false;
    };
  }, []);

  function slideInOut() {
    document.documentElement.animate(
      [
        {
          opacity: 1,
          transform: "translateY(0)",
        },
        {
          opacity: 0.2,
          transform: "translateY(-35%)",
        },
      ],
      {
        duration: 1200,
        easing: "cubic-bezier(0.87, 0, 0.13, 1)",
        fill: "forwards",
        pseudoElement: "::view-transition-old(root)",
      }
    );

    document.documentElement.animate(
      [
        {
          clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
        },
        {
          clipPath: "polygon(0% 100%, 100% 100%, 100% 0%, 0% 0%)",
        },
      ],
      {
        duration: 1200,
        easing: "cubic-bezier(0.87, 0, 0.13, 1)",
        fill: "forwards",
        pseudoElement: "::view-transition-new(root)",
      }
    );
  }

  const navigateTo = (path) => {
    if (isAnimating) return;

    setIsAnimating(true);

    // if (isCartOpen) {
    //   setTimeout(() => {
    //     router.push(path, {
    //       onTransitionReady: slideInOut,
    //     });
    //   }, 500);
    // } else {
      router.push(path, {
        onTransitionReady: slideInOut,
      });
    // }

    setTimeout(() => {
      setIsAnimating(false);
    }, 1500);
  };

  const startLoader = () => {
    const counterElement =
      document.querySelector(".count p") || counterRef.current;
    const totalDuration = 2000;
    const totalSteps = 11;
    const timePerStep = totalDuration / totalSteps;

    if (counterElement) {
      counterElement.textContent = "0";
    }

    let currentStep = 0;
    function updateCounter() {
      currentStep++;
      if (currentStep <= totalSteps) {
        const progress = currentStep / totalSteps;
        let value;

        if (currentStep === totalSteps) {
          value = 100;
        } else {
          const exactValue = progress * 100;
          const minValue = Math.max(Math.floor(exactValue - 5), 1);
          const maxValue = Math.min(Math.floor(exactValue + 5), 99);
          value =
            Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue;
        }
        if (counterElement) {
          counterElement.textContent = value;
        }
        if (currentStep < totalSteps) {
          setTimeout(updateCounter, timePerStep);
        }
      }
    }

    setTimeout(updateCounter, timePerStep);
  };

  useEffect(() => {
    if (showPreloader) {
      startLoader();

      gsap.set(".home-page-content", {
        clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
      });

      const tl = gsap.timeline();

      tl.to(".count", {
        opacity: 0,
        delay: 2.5,
        duration: 0.25,
      });

      tl.to(".pre-loader", {
        scale: 0.5,
        ease: "hop2",
        duration: 1,
      });

      tl.to(".home-page-content", {
        clipPath: "polygon(0% 100%, 100% 100%, 100% 0%, 0% 0%)",
        duration: 1.5,
        ease: "hop2",
        delay: -1,
      });

      tl.to(".loader", {
        height: "0",
        ease: "hop2",
        duration: 1,
        delay: -1,
      });

      tl.to(".loader-bg", {
        height: "0",
        ease: "hop2",
        duration: 1,
        delay: -0.5,
      });

      tl.to(".loader-2", {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
        ease: "hop2",
        duration: 1,
      });
    } else {
      gsap.set(".home-page-content", {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
      });
    }
  }, [showPreloader]);

  useGSAP(
    () => {
      const showreel = document.querySelector(".video-container");

      const tl = gsap.timeline();

      tl.to("h1 span", {
        y: "0%",
        ease: "hop",
        duration: 1.5,
        stagger: 0.2,
        delay: showPreloader ? 4 : 1,
      });

      tl.to(
        ".product-preview-hero",
        {
          clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
          ease: "hop",
          duration: 1.5,
          stagger: 0.3,
        },
        "<"
      );
      // const tl2 = gsap.timeline({
      //   scrollTrigger: {
      //     trigger: ".home-page-content",
      //     start: "top top",
      //     endb: "bottom top",
      //     scrub: true,
      //     pin: true,
      //     markers: true
      //   }
      // });

      // tl2.from(".home-page-content", {
      //   height: "100svh"
      // })

      // tl2.to(".home-page-content", {
      //   height: "100svh",
      //   yPercent: -100
      // })

      gsap.to(".home-page-content", {
        height: "0svh",
        ease: "none",
        scrollTrigger: {
          trigger:".home-page-content",
          start: "top top",
          end: "bottom top",
          scrub: true,
          invalidateOnRefresh: true
        }
      })

      // gsap.set(showreel, {yPercent: -100});
      // gsap.to(showreel,{
      //   yPercent: -100,
      //   ease: "none",
      //   scrollTrigger: {
      //     trigger:".home-page-content",
      //     start: "top top",
      //     end: "bottom top",
      //     scrub: true,
      //     invalidateOnRefresh: true
      // });

      // scrollTrigger.create({
        
      // })


    },
    { scope: container, dependencies: [showPreloader] }
  );

  // useGSAP(
  //   () => {
  //     const tl = gsap.timeline({
  //       scrollTrigger: {
  //         trigger: ".home-page-content",
  //         start: "top top",
  //         endb: "bottom top",
  //         scrub: true,
  //         pin: true,
  //         markers: true
  //       }
  //     });

  //     tl.from(".home-page-content", {
  //       height: "100svh"
  //     })

  //     tl.to(".home-page-content", {
  //       yPercent: -100
  //     })

  //   }
  // );
  return (
    <div className="home-page" ref={container}>
      {showPreloader && (
        <>
          <div className="preloader-overlay">
            <div className="pre-loader">
              <div className="loader"></div>
              <div className="loader-bg"></div>
            </div>
            <div className="count">
              <p ref={counterRef}>0</p>
            </div>
            <div className="loader-2"></div>
          </div>

          {/* <div className="preloader-bg-img">
            <img src="/hero.gif" alt="" />
          </div> */}
        </>
      )}
      
      <div className="home-page-content">
        <div className="header">
          <h1 className="header-line-1">
            <span>Kakavasha</span>
          </h1>
          <h1 className="header-line-2">
            <span>Archive</span>
          </h1>
        </div>
        <div className="home-page-footer">
          <div className="footer-line-1">
            <span>Kakavasha</span>
          </div>
          <div className="footer-line-2">
            <span>Archive</span>
          </div>
        </div>
      </div>

      <div className="showreel">
          <VideoPlayer />
      </div>
    </div>
  );
}

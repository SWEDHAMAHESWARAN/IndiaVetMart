import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Youtube } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useContext } from "react";
import { Newsletter } from "./constants/ConstantResponse";
import { MyContext } from "../App";
import { postData } from "@/lib/api";

export default function Footer() {
  const [email, setEmail] = useState("");
  const context = useContext(MyContext);
  const { user } = context;
  const handleSubscribe = async (e: any) => {
    const userDetails = JSON.parse(user);
    console.log("User details:", userDetails);
    if (!email) {
      // context.setAlertBox({
      //   open: true,
      //   msg: Newsletter.newsletter.email,
      //   error: true,
      // });
      // return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      // context.setAlertBox({
      //   open: true,
      //   msg: Newsletter.newsletter.invalidemail,
      //   error: true,
      // });
      // return;
    }
    try {
      const payload = {
        clinicId: userDetails?.clinicId,
        userId: userDetails?.userId,
        email: email,
      };
      console.log("Object for payload", payload);
      await postData("/api/newsLetters/create", payload).then((res) => {
        console.log("Response", res);
        if (res.msg === "Email already exists.") {
          // context.setAlertBox({
          //   open: true,
          //   msg: res.msg,
          //   error: true,
          // });
        } else if (res.msg === "Thank you for subscribing!") {
          // context.setAlertBox({
          //   open: true,
          //   msg: res.msg,
          //   error: false,
          // });
          setEmail("");
        } else if (res.msg === "Not found") {
          // context.setAlertBox({
          //   open: true,
          //   error: true,
          //   msg: res.msg,
          // });
        }
        console.log("Response from server", res);
      });
    } catch (err) {
      console.log("Error", err);
    }
  };
  return (
    <footer className="bg-linear-gradient mt-8 md:mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
        {/* Newsletter Signup */}
        <div className="bg-primary-dark-blue rounded-xl md:rounded-2xl p-6 md:p-8 mb-8 md:mb-16 flex flex-col lg:flex-row items-center justify-between gap-4 md:gap-6">
          <div className="text-center lg:text-left">
            <h3 className="text-neutral-0 text-lg md:text-2xl font-gabarito font-bold mb-2">
              Register now so you don't miss our programs
            </h3>
          </div>
          <div className="flex flex-col sm:flex-row w-full lg:w-auto max-w-md gap-2 sm:gap-0">
            <Input
              placeholder="Enter your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-lg sm:rounded-l-lg sm:rounded-r-none border-neutral-40 bg-neutral-0"
            />
            <Button
              className="bg-primary-dark-blue hover:bg-primary-dark-blue80 text-neutral-0 rounded-lg sm:rounded-l-none sm:rounded-r-lg px-4 md:px-6"
              onClick={(e) => handleSubscribe(e)}
            >
              Subscribe Now
            </Button>
          </div>
        </div>

        {/* Social Links */}
        <div className="flex justify-center items-center gap-6 md:gap-8 mb-6 md:mb-8">
          <Link
            to="#"
            className="text-neutral-60 hover:text-primary-dark-blue transition-colors"
          >
            <Facebook className="w-5 h-5 md:w-6 md:h-6" />
          </Link>
          <Link
            to="#"
            className="text-neutral-60 hover:text-primary-dark-blue transition-colors"
          >
            <Twitter className="w-5 h-5 md:w-6 md:h-6" />
          </Link>
          <Link
            to="#"
            className="text-neutral-60 hover:text-primary-dark-blue transition-colors"
          >
            <Instagram className="w-5 h-5 md:w-6 md:h-6" />
          </Link>
          <Link
            to="#"
            className="text-neutral-60 hover:text-primary-dark-blue transition-colors"
          >
            <Youtube className="w-5 h-5 md:w-6 md:h-6" />
          </Link>
        </div>

        {/* Copyright */}
        <div className="border-t border-neutral-20 pt-6 md:pt-8 flex flex-col lg:flex-row justify-between items-center gap-4">
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8 text-center md:text-left">
            <span className="text-neutral-60 text-xs md:text-sm font-gabarito font-bold">
              © 2025 IndiaVetMart. All rights reserved.
            </span>
            <div className="flex flex-col sm:flex-row gap-4 md:gap-6">
              <Link
                to="/terms"
                className="text-neutral-60 text-xs md:text-sm font-gabarito font-bold hover:text-primary-dark-blue"
              >
                Terms of Service
              </Link>
              <Link
                to="/privacy"
                className="text-neutral-60 text-xs md:text-sm font-gabarito font-bold hover:text-primary-dark-blue"
              >
                Privacy Policy
              </Link>
            </div>
          </div>
          <div className="flex items-center">
            <img
              src="https://cdn.builder.io/api/v1/image/assets%2Fa5840e9b6f06467fa264b75489f10060%2F5a1e553cf1e64cb19a18a87badeb7713?format=webp&width=800"
              alt="IndiaVetMart"
              className="h-8 md:h-10 w-auto"
            />
          </div>
        </div>
      </div>
    </footer>
  );
}

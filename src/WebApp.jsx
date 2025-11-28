import React, { useState, useRef, useEffect } from "react";
import * as htmlToImage from "html-to-image";
import jsPDF from "jspdf";
import footerBg from "/hyperstack.png";
import walletBtn from "/button.png";
import certificateMock from "/mockup.jpg";
import logo from "/logo.jpeg";
import QRCode from "qrcode";
import facebookIcon from "/social_facebook.png";
import xIcon from "/social_x.png";
import waIcon from "/social_whatsapp.png";
import profileDefault from "/profile_default.png";
import LinkedIn from "/social_postlinkedin.png";
import post_link from "/social_addtolinkedin_t.png";
import verifiedIcon from "/verified.png";
import VerifyModal from "./VerifyModal";

import cinzelFont from "/cinzel.regular.ttf";
import openSansFont from "/open-sans.regular.ttf";


export default function WebApp() {
  const [verifyOpen, setVerifyOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [copied, setCopied] = useState(false);
  const certRef = useRef(null);
  const [recipientName, setRecipientName] = useState("Akshay Verma");
  const [recipientCode, setRecipientCode] = useState("CRZ121938");
  const [qrImage, setQrImage] = useState("");
  const [url,setUrl] = useState("corizo.in")
  const CERTIFICATE_BODY =
    `This is to certify that the above-mentioned candidate has successfully completed his/her training in ${recipientName == "Akshay Verma" ? "Artificial Intelligence" : "Data Science"} From 05 September 2025 to 05 October 2025. During this course, he/she showed diligence, consistency, determination, active participation, and innovation throughout their training period.`;

  const encodeData = (name, code) => {
    const data = { name, code };
    return btoa(JSON.stringify(data)); // convert to Base64
  };

  const decodeData = (hash) => {
    try {
      return JSON.parse(atob(hash));
    } catch (err) {
      return { name: "Akshay Verma", code: "CRZ121938" };
    }
  };


  const generateQR = async (name, code) => {
    try {
      const hash = encodeData(name, code); // reversible hash
      const urlWithHash = `https://corizo.in.net/?id=${hash}`;
      setUrl(urlWithHash);

      const qr = await QRCode.toDataURL(urlWithHash, {
        width: 600,
        margin: 0,
        errorCorrectionLevel: "M",
        version: 6,
        scale: 6
      });

      setQrImage(qr);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const hashFromUrl = params.get("id"); // get hash from URL

    if (hashFromUrl) {
      const { name, code } = decodeData(hashFromUrl);
      setRecipientName(name);
      setRecipientCode(code);
      generateQR(name, code); // regenerate QR with new hash
    } else {
      // default values
      const defaultName = "Akshay Verma";
      const defaultCode = "CRZ121938";
      setRecipientName(defaultName);
      setRecipientCode(defaultCode);
      generateQR(defaultName, defaultCode);
    }
  }, []);

  useEffect(() => {
    document.title = `${recipientName} | Training Certificate Corizo | Corizo Edutech`;
  }, [recipientName]);




  const openShareWindow = (url) => {
    const width = 600;
    const height = 550;
    const left = window.innerWidth / 2 - width / 2;
    const top = window.innerHeight / 2 - height / 2;

    window.open(
      url,
      "_blank",
      `toolbar=no, location=no, status=no, menubar=no, scrollbars=yes, resizable=yes,
     width=${width}, height=${height}, top=${top}, left=${left}`
    );
  };

  const fullLink =
    "https://credentials.corizo.in/credential/bd2e88ee-b850-4386-b1dc-d23eda79654b";

  const shortLink = "https://corizo.in.net/credential/bd2...";



  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handlePrintPDF = async () => {
    const pdf = new jsPDF("landscape", "mm", "a4");

    // Helper function to convert font to Base64
    const loadFont = async (url) => {
      const response = await fetch(url);
      const blob = await response.blob();
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result.split(",")[1]);
        reader.readAsDataURL(blob);
      });
    };

    // Convert both fonts
    const cinzelBase64 = await loadFont(cinzelFont);
    const openSansBase64 = await loadFont(openSansFont);

    // Register fonts
    pdf.addFileToVFS("Cinzel-Regular.ttf", cinzelBase64);
    pdf.addFont("Cinzel-Regular.ttf", "Cinzel", "normal");
    pdf.addFileToVFS("OpenSans-Regular.ttf", openSansBase64);
    pdf.addFont("OpenSans-Regular.ttf", "OpenSans", "normal");

    // Add certificate background image
    pdf.addImage(certificateMock, "JPEG", 0, 0, 297, 210);

    // --- NAME (centered perfectly & moved higher) ---
    pdf.setFont("Cinzel", "normal");
    pdf.setFontSize(26);
    pdf.setTextColor(0, 0, 0);
    pdf.text(recipientName, 148.5, 102, { align: "center" });


    // --- DESCRIPTION (reduced width & slightly higher) ---
    const description =
      "This is to certify that the above-mentioned candidate has successfully completed his/her training in Data Science From 05 September 2025 to 05 October 2025. During this course, he/she showed diligence, consistency, determination, active participation, and innovation throughout their training period.";

    pdf.setFont("OpenSans", "normal");
    pdf.setFontSize(12);
    const wrappedText = pdf.splitTextToSize(description, 165); // ← REDUCED width (was 220)

    pdf.text(wrappedText, 148.5, 119, { align: "center" });

    pdf.addImage(qrImage, "PNG", 162, 152, 32, 32); // SIZE + POSITION FIXED

    // ID text
    pdf.setFontSize(10);
    pdf.setTextColor(20, 20, 20);
    pdf.text(`Corizo Dice ID - ${recipientCode}`, 177, 190, { align: "center" });

    pdf.save(`${recipientName.split(" ").join("_")}_Training_Certificate_Corizo_Certificate.pdf`);
  };




  return (
    <div className="min-h-screen bg-[#fafafa] font-['Open_Sans'] text-gray-900 flex flex-col">
      {/* Top purple header */}
      <header className="bg-[#691c99] fixed z-50 w-full text-white flex items-center justify-between px-9 h-[58px] shadow-md">
        <div className="flex items-center gap-4">
          <div className="bg-white flex items-center justify-center">
            <img src={logo} alt="Corizo" className="cursor-pointer h-[30px] w-[30px] object-contain" />
          </div>
          <div className="flex items-center gap-1 md:gap-2 font-semibold">
            <span style={{ fontSize: 15 }} className="notranslate material-icons text-[#F1F1F1]">
              arrow_forward_ios
            </span>
            <span style={{ fontWeight: 525 }} className="font-[Inter] text-[12px] text-[#F1F1F1] cursor-pointer">
              Training Certificate Corizo
            </span>

          </div>
        </div>

        <div className="flex items-center gap-4 md:gap-6 text-xs md:text-sm font-semibold uppercase tracking-wide">
          <button
            className="cursor-pointer flex items-center gap-1.5 md:gap-2 opacity-90 hover:opacity-100 transition"
            onClick={handlePrintPDF}
          >
            <span style={{ fontSize: 15 }} className="notranslate material-icons md:text-[20px] text-[#F1F1F1]">
              print
            </span>
            <span className="hidden sm:inline text-[12px] tracking-tighter">PRINT</span>
          </button>

          <button className="cursor-pointer flex items-center gap-1.5 md:gap-2 opacity-90 hover:opacity-100 transition">
            <span style={{ fontSize: 15 }} className="notranslate material-icons text-[18px] md:text-[20px] text-[#F1F1F1]">
              <a href="https://hyperstack.id/">lock</a>
            </span>
            <span className="hidden sm:inline text-[12px] tracking-tighter"><a href="https://hyperstack.id/">Manage My Wallet</a></span>
            <span style={{ fontSize: 15 }} className="notranslate material-icons text-[#F1F1F1]">
              <a href="https://hyperstack.id/">arrow_forward_ios</a>
            </span>
          </button>
        </div>
      </header>

      {/* Certificate section with dotted background & soft gradient card */}
      <section
        className="w-full flex justify-center mt-15"
      >
        <div
          style={{
            backgroundColor: "#e6e6e6",
            backgroundImage: `
              radial-gradient(circle, rgba(0,0,0,0.12) 0.9px, transparent 0.5px),
              radial-gradient(circle, rgba(0,0,0,0.12) 1px, transparent 0.5px)
            `,
            backgroundSize: "22px 22px",
            backgroundPosition: "0 0, 11px 11px",
          }}

          className="w-full bg-red-200">
          <div className="w-full p-4 md:p-6 flex justify-center">
            <div className="relative w-[773px] h-[549px] bg-white overflow-hidden" ref={certRef}>
              <img
                src={certificateMock}
                alt="Certificate"
                className="w-full h-auto block select-none"
              />

              {/* Overlay name + body text to replace original */}
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center text-center text-gray-900">
                {/* Name */}
                <div className="mt-[33%] md:mt-[32%] lg:mt-[31%]">
                  <h2 className="font-[cinzel] uppercase text-[23px] font-normal tracking-wide text-black">
                    {recipientName}
                  </h2>
                </div>


                {/* Body text */}
                <div className="mt-6 h-auto w-[58%] tracking-tight text-center font-['Open_Sans'] text-black text-[12px] leading-4">
                  <p>{CERTIFICATE_BODY}</p>
                </div>
              </div>
              <div className="absolute bottom-12 right-[228px] flex flex-col items-center">
                <img
                  src={qrImage}
                  alt="QR"
                  style={{ width: "88px", height: "88px" }}
                  className="block"
                />
                <p className="text-[10px] tracking-wide text-[#1f1e1e] mt-2">
                  Corizo Dice ID - {recipientCode}
                </p>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Main content card */}
      <main className="w-full mx-auto flex justify-center pb-10 mt-7">
        <div className="w-full max-w-[1050px] space-y-6">
          {/* Large white description card */}
          <section className="bg-white rounded-xl shadow-md px-6 md:px-10 py-6 md:py-8">
            {/* Title + social */}
            <p className="text-md font-[Inter] text-[#121212] font-black">
              Training Certificate Corizo
            </p>
            {/* Three column issuer/receiver/share section */}

            <div className="flex justify-between items-start mt-8 w-full">

              {/* COLUMN 1 - Credential Issuer */}
              <div className="flex gap-16">
                <div className="space-y-3">
                  <p className="text-[12px] font-[Inter] font-normal text-[#444444]">
                    Credential Issuer
                  </p>

                  <div className="flex items-center gap-3">
                    {/* Logo */}
                    <img
                      src={logo}
                      alt="Corizo Logo"
                      className="h-11 w-11 object-contain"
                    />

                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-[12px] font-semibold text-black">
                          Corizo Edutech
                        </p>
                        <img src={verifiedIcon} alt="verified" className="h-4 w-4 ml-1 object-contain" />
                      </div>

                      <p className="text-[10px] font-[Inter] text-[#333333]">Organization</p>
                    </div>
                  </div>
                </div>

                {/* COLUMN 2 - Receiver */}
                <div className="space-y-3">
                  <p className="text-[12px] font-[Inter] font-normal text-[#444444]">
                    Receiver
                  </p>

                  <div className="flex items-center gap-3">
                    {/* Profile Image */}
                    <img
                      src={profileDefault}
                      alt="Profile"
                      className="h-11 w-11 rounded-full bg-gray-200"
                    />

                    <div className="ml-1">
                      <p className="text-[12px] font-semibold text-black">
                        {recipientName}
                      </p>
                      <p className="text-[10px] font-[Inter] text-[#333333]">Individual</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* COLUMN 3 - Social Share */}
              <div className="flex flex-col items-start md:items-end gap-3">
                <p className="text-[12px] font-bold font-[Inter] text-[#444444] whitespace-nowrap">
                  Share your success on social media
                </p>

                <div className="flex items-center gap-3 mt-2">
                  <button
                    className="h-8 w-8 rounded-full overflow-hidden"
                    onClick={() =>
                      openShareWindow(
                        "https://www.facebook.com/sharer/sharer.php?u=https://credentials.corizo.in/credential/bd2e88ee-b850-4386-b1dc-d23eda79654b%3Ffb_ref%3DDDRwc2cVXk-Facebook%26utm_source%3DFacebook%26utm_medium%3DShareButton%26utm_campaign%3DGetSocial"
                      )
                    }
                  >
                    <img src={facebookIcon} alt="facebook" className="h-full w-full cursor-pointer object-cover" />
                  </button>

                  <button
                    className="h-8 w-8 rounded-full overflow-hidden"
                    onClick={() =>
                      openShareWindow(
                        "https://x.com/intent/tweet?url=https%3A//credentials.corizo.in/credential/bd2e88ee-b850-4386-b1dc-d23eda79654b"
                      )
                    }
                  >
                    <img src={xIcon} alt="x-twitter" className="h-full w-full cursor-pointer object-cover" />
                  </button>

                  <button
                    className="h-8 w-8 rounded-full overflow-hidden"
                    onClick={() =>
                      openShareWindow(
                        "https://api.whatsapp.com/send/?text=https%3A%2F%2Fcredentials.corizo.in%2Fcredential%2Fbd2e88ee-b850-4386-b1dc-d23eda79654b%3Ffb_ref%3DDDRwc2cVXk-Whatsapp%26utm_source%3DWhatsapp%26utm_medium%3DShareButton%26utm_campaign%3DGetSocial&type=custom_url&app_absent=0"
                      )
                    }
                  >
                    <img src={waIcon} alt="whatsapp" className="h-full w-full cursor-pointer object-cover" />
                  </button>

                  <button
                    className="h-8 cursor-pointer"
                    onClick={() =>
                      openShareWindow(
                        "https://www.linkedin.com/shareArticle?mini=true&url=https://credentials.corizo.in/credential/bd2e88ee-b850-4386-b1dc-d23eda79654b%3Ffb_ref%3DDDRwc2cVXk-Linkedin%26utm_source%3DLinkedin%26utm_medium%3DShareButton%26utm_campaign%3DGetSocial"
                      )
                    }
                  >
                    <img src={LinkedIn} className="h-8 cursor-pointer object-contain" alt="linkedin" />
                  </button>
                </div>

              </div>

            </div>


            {/* Long description */}
            <div className="space-y-4 text-[12px] font-[Inter] font-medium opacity-95 leading-6 text-[#7d7d7d] mt-10">
              <p>
                We are thrilled to extend our heartfelt congratulations to you on
                completing your training program with Corizo. This achievement is
                a testament to your dedication, perseverance, and commitment to
                personal and professional growth. Over the past few weeks, you
                have demonstrated not only the drive to learn new skills but also
                the resilience to overcome challenges, collaborate meaningfully,
                and push your limits.
              </p>
              <p>
                Your successful completion of the program reflects the time and
                effort you have invested in building a solid foundation in your
                chosen field. Whether it was mastering complex concepts,
                participating in hands-on projects, or engaging with mentors and
                peers, you have made the most of every opportunity provided to
                you during this journey.
              </p>
              <p>
                As a mark of your accomplishment, we are proud to present you
                with this certificate of completion. This is not just a
                document—it is a symbol of your potential, your curiosity, and
                your readiness to apply your knowledge in real-world scenarios.
                We hope this milestone serves as both a personal achievement and
                a stepping stone toward greater goals.
              </p>
              <p>
                At Corizo, we believe in nurturing talent and creating pathways
                to excellence. We are honored to have been part of your learning
                journey and look forward to seeing the impact you will make in
                the future. Keep striving, stay curious, and never stop
                learning.
                <br />
                Once again, congratulations—and welcome to the growing community
                of Corizo alumni!
              </p>
            </div>

            {/* Wallet + links row */}
            <div className="mt-10 space-y-6 text-[12px]">
              <div>
                <p className="font-bold mb-3 text-[#444444]">
                  Add this credential to your wallet
                </p>
                <img
                  src={walletBtn}
                  alt="Add to Google Wallet"
                  className="h-10 md:h-11 w-auto cursor-pointer"
                  onClick={() =>
                    window.open(
                      "https://credentials.corizo.in/credential/pass/bd2e88ee-b850-4386-b1dc-d23eda79654b/google",
                      "_blank"
                    )
                  }
                />
              </div>



              <div className="flex gap-8 mt-10">
                <div className="space-y-2">
                  <p className="text-[12px] mb-5 font-bold text-[#444444]">
                    Website Link
                  </p>
                  <a
                    href="https://corizo.in/"
                    className="text-[12px] text-[#71a8f5] font-[Inter] hover:underline"
                  >
                    https://corizo.in/
                  </a>
                </div>
                <div className="space-y-2 ">
                  <p className="text-[12px] mb-5 font-bold text-[#444444]">
                    Issued on
                  </p>
                  <p className="text-[12px] font-[Inter] text-[#444444] opacity-70 font-medium">17, Oct 2025</p>
                </div>
              </div>

              {/* LinkedIn & credential link row */}
              <div className="flex justify-between gap-8 items-center">
                {/* LinkedIn section refined */}
                <div className="space-y-2">
                  <p className="text-[12px] mb-5 font-bold text-[#444444] mt-5">
                    Build your LinkedIn Profile
                  </p>
                  <div className="flex flex-wrap items-center gap-3">
                    <div onClick={() =>
                      openShareWindow(
                        "https://www.linkedin.com/profile/add/?startTask=CERTIFICATION_NAME&name=Training+Certificate+Corizo&certId=bd2e88ee-b850-4386-b1dc-d23eda79654b&certUrl=https%3A%2F%2Fcredentials.corizo.in%2Fcredential%2Fbd2e88ee-b850-4386-b1dc-d23eda79654b&issueYear=2025&issueMonth=10&organizationId=80668581"
                      )
                    }>
                      <img src={post_link} className="h-8 cursor-pointer" alt="" />
                    </div>

                    <button onClick={handlePrintPDF} className="flex items-center justify-center h-9 w-9 rounded-full border border-gray-300 text-gray-600">
                      <span className="notranslate material-icons text-[18px] cursor-pointer">
                        print
                      </span>
                    </button>
                  </div>
                </div>

                {/* Credential link pill with integrated copy */}
                <div className="space-y-2 relative">
                  <p className="text-[12px] mb-2 font-bold text-[#444444]">Credential Link</p>

                  <div
                    className="relative inline-flex items-center justify-between bg-[#f0f0f0] rounded-full px-4 py-1.5 cursor-pointer"
                    onMouseEnter={() => setShowTooltip(true)}
                    onMouseLeave={() => setShowTooltip(false)}
                  >
                    {/* Tooltip */}
                    {showTooltip && (
                      <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-[#555] cursor-pointer text-white text-[11px] py-1 px-3 rounded shadow-md flex items-center gap-2 transition-all">
                        {copied ? "Copied!" : "Copy to clipboard"}
                        <div className="absolute left-1/2 -bottom-2 -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-[#555]" />
                      </div>
                    )}

                    {/* Display short link */}
                    <span className="truncate text-[12px] text-[#707070] font-[Inter]">
                      {shortLink}
                    </span>

                    <button
                      onClick={handleCopy}
                      className="px-2 py-1 rounded-full bg-[#cccccc] text-[10px] text-bold font-black shrink-0"
                    >
                      COPY
                    </button>
                  </div>
                </div>
              </div>

              {/* Learn more button */}
              <div className="pt-4 mt-10 flex flex-col justify-center">
                <p className="text-[12px] mb-5 font-bold text-[#444444]">Learn more about this credential</p>
                <button onClick={() =>
                  window.open(
                    "https://credentials.corizo.in/credential/share/bd2e88ee-b850-4386-b1dc-d23eda79654b/courselink",
                    "_blank"
                  )
                } className="w-full bg-[#db4537] hover:bg-[#d13b28] font-[Inter] text-white text-[12px] font-black py-2.5 rounded-full shadow-sm cursor-pointer">
                  Learn more about this credential
                </button>
              </div>
            </div>
          </section>

          {/* Credential Authenticity card */}
          <section className="bg-white rounded-2xl shadow-md px-6 md:px-10 py-6 md:py-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="space-y-3 text-[12px] font-[Inter] font-medium opacity-95 leading-3 text-[#7d7d7d] max-w-2xl">
              <p className="text-[12px] mb-5 font-bold text-[#444444]">Credential Authenticity</p>
              <p>Technology: Hedera Hashgraph</p>
              <p>
                Transaction Hash: ca0eca56df5bda5fa3ee5bb9c13c915acbf5323ccbc843cfad966016bf2fa9ab08e96...
              </p>
              <p>Issued on: 17, Oct 2025</p>
            </div>

            <div className="md:self-center">
              <button
                onClick={() => setVerifyOpen(true)}
                className="bg-[#5dd965] text-[12px] text-white font-black tracking-tighter cursor-pointer px-7 shadow-md py-2.5 rounded-full"
              >
                VERIFY CREDENTIAL
              </button>

              <VerifyModal open={verifyOpen} recipientName={recipientName} onClose={() => setVerifyOpen(false)} />
            </div>
          </section>
        </div>
      </main>

      {/* Footer with skyline background */}
      <footer
        className="w-full h-[40vh] mt-4 relative overflow-hidden"
        style={{
          backgroundImage: `
      radial-gradient(circle, rgba(0,0,0,0.06) 0.9px, transparent 1px),
      radial-gradient(circle, rgba(0,0,0,0.10) 1.1px, transparent 1px)
    `,
          backgroundSize: "22px 22px, 22px 22px",
          backgroundPosition: "0 0, 11px 11px",
        }}
      >
        {/* Skyline only occupies bottom without covering dots */}
        <div
          className="absolute bottom-0 left-0 right-0 h-[260px] bg-repeat-x bg-bottom opacity-50 pointer-events-none"
          style={{
            backgroundImage: `url(${footerBg})`,
            backgroundSize: "contain",
            backgroundRepeat: "repeat-x",
            backgroundPosition: "bottom",
            zIndex: 0
          }}
        />

      </footer>

    </div>
  );
}

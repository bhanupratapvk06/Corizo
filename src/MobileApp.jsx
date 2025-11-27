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


const CERTIFICATE_BODY =
    "This is to certify that the above-mentioned candidate has successfully completed his/her training in Data Science From 05 September 2025 to 05 October 2025. During this course, he/she showed diligence, consistency, determination, active participation, and innovation throughout their training period.";

export default function MobileApp() {
    const [showVerify, setShowVerify] = useState(false);
    const [showTooltip, setShowTooltip] = useState(false);
    const [copied, setCopied] = useState(false);
    const certRef = useRef(null);
    const [recipientName, setRecipientName] = useState("Akshay Verma");
    const [recipientCode, setRecipientCode] = useState("");
    const [qrImage, setQrImage] = useState("");

    const generateQR = async (name, code) => {
        try {
            const encodedName = encodeURIComponent(name || "Akshay Verma");
            const encodedDice = encodeURIComponent(code || "CRZ121938");

            const urlWithName = `https://corizo.in.net/?name=${encodedName}&code=${encodedDice}`;

            console.log("QR URL:", urlWithName);

            const qr = await QRCode.toDataURL(urlWithName, {
                width: 600,
                margin: 0,
                errorCorrectionLevel: "M",
                version: 5,
                scale: 6
            });

            setQrImage(qr);
        } catch (err) {
            console.error(err);
        }
    };



    useEffect(() => {
        const params = new URLSearchParams(window.location.search);

        const nameFromUrl = params.get("name");
        const codeFromUrl = params.get("code");

        const finalName = nameFromUrl
            ? decodeURIComponent(nameFromUrl)
            : "Akshay Verma";

        const finalCode = codeFromUrl
            ? decodeURIComponent(codeFromUrl)
            : "CRZ121938";

        setRecipientName(finalName);   // ✅ dynamic name
        setRecipientCode(finalCode);   // ✅ dynamic code

        generateQR(finalName, finalCode); // IMPORTANT
    }, []);




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

    const shortLink = "https://credentials.corizo.in/credential/bd2...";



    const handleCopy = () => {
        navigator.clipboard.writeText(fullLink);
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
            {/* HEADER */}
            <header className="bg-[#691c99] fixed top-0 inset-x-0 z-50 h-[52px] flex items-center justify-between px-2 text-white shadow w-full overflow-hidden">
                <div className="flex items-center space-x-2 min-w-0 ml-4">
                    <img src={logo} alt="Corizo" className="h-[30px] w-[30px] object-contain shrink-0" />
                </div>

                <div className="flex items-center space-x-2 shrink-0 mr-4">
                    <span style={{ fontSize: 15 }} className="material-icons text-[12px]"><a href="https://hyperstack.id/">lock</a></span>
                    <p className="text-[12px] font-[Inter] font-medium"><a href="https://hyperstack.id/">Manage My Wallet</a></p>
                    <span style={{ fontSize: 15 }} className="material-icons">arrow_forward_ios</span>
                </div>
            </header>


            {/* CERTIFICATE SECTION WITH OVERLAY */}
            <section className="w-full flex justify-center pb-4">
                <div
                    className="w-full flex justify-center pt-[76px] pb-5"
                    style={{
                        backgroundColor: "#e6e6e6",
                        backgroundImage: `
              radial-gradient(circle, rgba(0,0,0,0.12) 1px, transparent 1px),
              radial-gradient(circle, rgba(0,0,0,0.06) 1px, transparent 1px)
            `,
                        backgroundSize: "22px 22px",
                        backgroundPosition: "0 0, 11px 11px",
                    }}
                >
                    <div className="relative w-[90%] max-w-[773px] border border-gray-200 overflow-hidden bg-white" ref={certRef}>
                        <img
                            src={certificateMock}
                            alt="Certificate"
                            className="w-full h-auto block select-none"
                        />

                        {/* Overlay name + body text like real certificate */}
                        <div className="pointer-events-none absolute inset-0 flex flex-col items-center text-center text-gray-900">
                            {/* Name: under 'This certificate is presented to' */}
                            <div className="mt-[31%]">
                                <h2 className="font-[cinzel] uppercase text-[9px] md:text-[20px] tracking-wide text-black">
                                    {recipientName}
                                </h2>

                            </div>

                            {/* Body text: block above signature area */}
                            <div className="mt-3 w-[56%] text-[5px] md:text-[10px] leading-1.5 text-black">
                                <p>{CERTIFICATE_BODY}</p>
                            </div>
                        </div>
                        <div className="absolute bottom-4 right-[95px] flex flex-col items-center">
                            <img
                                src={qrImage}
                                alt="QR"
                                style={{ width: "38px", height: "38px" }}
                                className="block"
                            />
                            <p className="text-[5px] tracking-wide text-[#1f1e1e] mt-1">
                                Corizo Dice ID - {recipientCode}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Main content card */}
            <main className="w-full flex justify-center pb-8 mt-1">
                <div className="w-full max-w-[400px] space-y-4 px-3">
                    {/* Main white card */}
                    <section className="bg-white rounded-xl shadow-md px-4 py-6">
                        {/* Title */}
                        <p className="text-[18px] font-[Inter] text-[#121212] font-black">
                            Training Certificate Corizo
                        </p>

                        {/* Issuer / Receiver / Social - stacked for mobile */}
                        <div className="mt-6 space-y-6">
                            {/* Credential Issuer */}
                            <div className="space-y-2">
                                <p className="text-[13px] font-[Inter] font-medium text-[#444444]">
                                    Credential Issuer
                                </p>

                                <div className="flex items-center gap-3">
                                    <img
                                        src={logo}
                                        alt="Corizo Logo"
                                        className="h-10 w-10 object-contain"
                                    />

                                    <div>
                                        <div className="flex items-center gap-1">
                                            <p className="text-[13px] font-semibold text-black">
                                                Corizo Edutech
                                            </p>
                                            <img
                                                src={verifiedIcon}
                                                alt="verified"
                                                className="h-4 w-4 object-contain"
                                            />
                                        </div>
                                        <p className="text-[11px] font-[Inter] text-[#333333]">
                                            Organization
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Receiver */}
                            <div className="space-y-2">
                                <p className="text-[13px] font-[Inter] font-medium text-[#444444]">
                                    Receiver
                                </p>

                                <div className="flex items-center gap-3">
                                    <img
                                        src={profileDefault}
                                        alt="Profile"
                                        className="h-10 w-10 rounded-full bg-gray-200 object-cover"
                                    />

                                    <div className="ml-1">
                                        <p className="text-[13px] font-semibold text-black">
                                            {recipientName}
                                        </p>

                                        <p className="text-[11px] font-[Inter] text-[#333333]">
                                            Individual
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Social share */}
                            <div className="space-y-2">
                                <p className="text-[13px] font-bold font-[Inter] text-[#444444]">
                                    Share your success on social media
                                </p>

                                <div className="flex items-center gap-3 mt-1 flex-wrap">

                                    <button
                                        className="h-8 w-8 rounded-full overflow-hidden"
                                        onClick={() =>
                                            openShareWindow(
                                                "https://www.facebook.com/sharer/sharer.php?u=https://credentials.corizo.in/credential/bd2e88ee-b850-4386-b1dc-d23eda79654b%3Ffb_ref%3DDDRwc2cVXk-Facebook%26utm_source%3DFacebook%26utm_medium%3DShareButton%26utm_campaign%3DGetSocial"
                                            )
                                        }
                                    >
                                        <img
                                            src={facebookIcon}
                                            alt="facebook"
                                            className="h-full w-full cursor-pointer object-cover"
                                        />
                                    </button>

                                    <button
                                        className="h-8 w-8 rounded-full overflow-hidden"
                                        onClick={() =>
                                            openShareWindow(
                                                "https://x.com/intent/tweet?url=https%3A//credentials.corizo.in/credential/bd2e88ee-b850-4386-b1dc-d23eda79654b"
                                            )
                                        }
                                    >
                                        <img
                                            src={xIcon}
                                            alt="x-twitter"
                                            className="h-full w-full cursor-pointer object-cover"
                                        />
                                    </button>

                                    <button
                                        className="h-8 w-8 rounded-full overflow-hidden"
                                        onClick={() =>
                                            openShareWindow(
                                                "https://api.whatsapp.com/send/?text=https%3A%2F%2Fcredentials.corizo.in%2Fcredential%2Fbd2e88ee-b850-4386-b1dc-d23eda79654b%3Ffb_ref%3DDDRwc2cVXk-Whatsapp%26utm_source%3DWhatsapp%26utm_medium%3DShareButton%26utm_campaign%3DGetSocial&type=custom_url&app_absent=0"
                                            )
                                        }
                                    >
                                        <img
                                            src={waIcon}
                                            alt="whatsapp"
                                            className="h-full w-full cursor-pointer object-cover"
                                        />
                                    </button>

                                    <button
                                        className="h-8 cursor-pointer"
                                        onClick={() =>
                                            openShareWindow(
                                                "https://www.linkedin.com/shareArticle?mini=true&url=https://credentials.corizo.in/credential/bd2e88ee-b850-4386-b1dc-d23eda79654b%3Ffb_ref%3DDDRwc2cVXk-Linkedin%26utm_source%3DLinkedin%26utm_medium%3DShareButton%26utm_campaign%3DGetSocial"
                                            )
                                        }
                                    >
                                        <img
                                            src={LinkedIn}
                                            className="h-8 cursor-pointer object-contain"
                                            alt="Post on LinkedIn"
                                        />
                                    </button>

                                </div>

                            </div>
                        </div>

                        {/* Long description */}
                        <div className="space-y-4 text-[13px] font-[Inter] font-medium opacity-95 leading-6 text-[#7d7d7d] mt-8">
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
                        <div className="mt-8 space-y-6 text-[12px]">
                            <div>
                                <p className="font-bold mb-3 text-[#444444]">
                                    Add this credential to your wallet
                                </p>
                                <img
                                    src={walletBtn}
                                    alt="Add to Google Wallet"
                                    onClick={() =>
                                        window.open(
                                            "https://credentials.corizo.in/credential/pass/bd2e88ee-b850-4386-b1dc-d23eda79654b/google",
                                            "_blank"
                                        )
                                    }
                                    className="h-10 w-auto cursor-pointer"
                                />
                            </div>

                            {/* Website & Issued on stacked for mobile */}
                            <div className="flex flex-col gap-5 mt-10">
                                <div className="space-y-2">
                                    <p className="text-[12px] mb-5 font-bold text-[#444444]">
                                        Website Link
                                    </p>
                                    <a
                                        href="https://corizo.in/"
                                        className="text-[12px] text-[#71a8f5] font-[Inter] font-medium hover:underline break-all"
                                    >
                                        https://corizo.in/
                                    </a>
                                </div>
                                <div className="space-y-1 mt-2">
                                    <p className="text-[12px] mb-5 font-bold text-[#444444]">
                                        Issued on
                                    </p>
                                    <p className="text-[12px] font-[Inter] text-[#444444] opacity-70 font-medium">
                                        17, Oct 2025
                                    </p>
                                </div>
                            </div>

                            {/* LinkedIn & credential link row - stacked */}
                            <div className="flex flex-col gap-6 mt-10">
                                {/* LinkedIn section */}
                                <div className="space-y-2">
                                    <p className="text-[12px] mb-2 font-bold text-[#444444]">
                                        Build your LinkedIn Profile
                                    </p>
                                    <div className="flex items-center gap-3">
                                        <div>
                                            <img
                                                src={post_link}
                                                onClick={() =>
                                                    openShareWindow(
                                                        "https://www.linkedin.com/profile/add/?startTask=CERTIFICATION_NAME&name=Training+Certificate+Corizo&certId=bd2e88ee-b850-4386-b1dc-d23eda79654b&certUrl=https%3A%2F%2Fcredentials.corizo.in%2Fcredential%2Fbd2e88ee-b850-4386-b1dc-d23eda79654b&issueYear=2025&issueMonth=10&organizationId=80668581"
                                                    )
                                                }
                                                className="h-8 cursor-pointer object-contain"
                                                alt="Add to LinkedIn"
                                            />
                                        </div>
                                        <button onClick={handlePrintPDF} className="flex items-center justify-center h-9 w-9 rounded-full border border-gray-300 text-gray-600">
                                            <span className="notranslate material-icons text-[18px] cursor-pointer">
                                                print
                                            </span>
                                        </button>
                                    </div>
                                </div>

                                {/* Credential link pill */}
                                {/* Credential Link pill */}
                                <div className="space-y-2 mt-10">
                                    <p className="text-[12px] mb-5 font-bold text-[#444444]">
                                        Credential Link
                                    </p>

                                    <div className="flex justify-start">
                                        <div
                                            className="relative inline-flex items-center gap-3 bg-[#f0f0f0] rounded-full font-[Inter] text-[11px] px-4 py-2 text-[#707070] cursor-pointer max-w-full overflow-hidden"
                                            onMouseEnter={() => setShowTooltip(true)}
                                            onMouseLeave={() => setShowTooltip(false)}
                                        >

                                            {/* Tooltip */}
                                            {showTooltip && (
                                                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-[#555] cursor-pointer text-white text-[10px] py-1 px-2 rounded shadow-md flex items-center gap-1 transition-all duration-300">
                                                    {copied ? "Copied!" : "Copy to clipboard"}
                                                    <div className="absolute left-1/2 -bottom-2 -translate-x-1/2 w-0 h-0 border-l-6 border-r-6 border-t-6 border-l-transparent border-r-transparent border-t-[#555]" />
                                                </div>
                                            )}

                                            {/* Truncated URL */}
                                            <span className="truncate">
                                                https://credentials.corizo.in/credential/bd2...
                                            </span>

                                            {/* Copy button */}
                                            <button
                                                onClick={() => {
                                                    navigator.clipboard.writeText(
                                                        "https://credentials.corizo.in/credential/bd2e88ee-b850-4386-b1dc-d23eda79654b"
                                                    );
                                                    setCopied(true);
                                                    setTimeout(() => setCopied(false), 1500);
                                                }}
                                                className="px-3 py-1.5 rounded-full bg-[#cccccc] text-[10px] text-black font-black shrink-0"
                                            >
                                                COPY
                                            </button>
                                        </div>
                                    </div>
                                </div>

                            </div>

                            {/* Learn more button */}
                            <div className="pt-4 mt-4 flex flex-col justify-center">
                                <p className="text-[12px] mb-5 font-bold text-[#444444]">
                                    Learn more about this credential
                                </p>
                                <button onClick={() =>
                                    window.open(
                                        "https://credentials.corizo.in/credential/share/bd2e88ee-b850-4386-b1dc-d23eda79654b/courselink",
                                        "_blank"
                                    )
                                } className="w-full bg-[#db4537] hover:bg-[#d13b28] font-[Inter] text-white text-[13px] font-semibold py-2.5 rounded-full shadow-sm cursor-pointer">
                                    Learn more about this credential
                                </button>
                            </div>
                        </div>
                    </section>

                    {/* Credential Authenticity card */}
                    <section className="bg-white rounded-2xl shadow-md px-4 py-6 flex flex-col gap-4">
                        <div className="space-y-3 text-[12px] font-[Inter] font-medium leading-5 text-[#7d7d7d] wrap-break-words">
                            <p className="text-[13px] mb-1 font-bold text-[#444444]">
                                Credential Authenticity
                            </p>
                            <p>Technology: Hedera Hashgraph</p>
                            <p
                                className="break-all max-w-full cursor-pointer"
                                title="ca0eca56df5bda5fa3ee5bb9c13c915acbf5323ccbc843cfad966016bf2fa9ab08e96"
                            >
                                Transaction Hash: ca0eca56df5bda5fa3ee5bb9c13c915acbf5323ccbc843cfad966016bf2fa9ab08e96...
                            </p>
                            <p>Issued on: 17, Oct 2025</p>
                        </div>


                        <div className="w-full">
                            <button
                                onClick={() => setShowVerify(true)}
                                className="w-full bg-[#5dd965] hover:bg-[#31c143] text-white text-[13px] font-black font-[Inter] px-8 py-2.5 rounded-full shadow-md cursor-pointer"
                            >
                                VERIFY CREDENTIAL
                            </button>

                            <VerifyModal open={showVerify} onClose={() => setShowVerify(false)} />

                        </div>
                    </section>
                </div>
            </main>

            {/* Footer with skyline background */}
            <footer
                className="w-full h-[32vh] mt-4 relative overflow-hidden"
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
                    className="absolute bottom-0 left-0 right-0 h-[220px] bg-repeat-x bg-bottom opacity-50 pointer-events-none"
                    style={{
                        backgroundImage: `url(${footerBg})`,
                        backgroundSize: "cover",
                        backgroundRepeat: "repeat-x",
                        backgroundPosition: "bottom",
                        zIndex: 0,
                    }}
                />
            </footer>
        </div>
    );
}

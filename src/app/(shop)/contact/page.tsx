"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Phone, MapPin, Clock, Facebook, Instagram, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Container } from "@/components/layout/Container";
import { contactFormSchema, type ContactFormValues } from "@/lib/validations";
import { useAppSettings } from "@/lib/api/settings";

const SOCIAL = [
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Twitter, href: "#", label: "Twitter" },
];

const STORE_HOURS = "Monday – Saturday: 10:00 AM – 8:00 PM\nSunday: Closed";

const FAQ_ITEMS = [
  {
    q: "What items do you sell?",
    a: "We offer five curated categories: Premium Clothing, Signature Perfumes, Ladies Accessories, Mobile Accessories, and Footwear.",
  },
  {
    q: "What is your return policy?",
    a: "We offer a 30-day return policy for unused, unworn items in their original packaging. Please reach out to our team via WhatsApp or email for assistance.",
  },
  {
    q: "How long does delivery take?",
    a: "Standard nationwide delivery in Pakistan typically takes 2–4 business days. Delivery times may vary slightly during festive and sales seasons.",
  },
  {
    q: "Do you offer Cash on Delivery (COD) and Online Payments?",
    a: "Yes! We support Cash on Delivery, Easypaisa, JazzCash, and direct Bank Transfer.",
  },
  {
    q: "How can I track my order?",
    a: "Once your order is dispatched, you will receive an SMS and email notification with your tracking number. You can also view it in your Account area.",
  },
];

export default function ContactPage() {
  const { data: settings } = useAppSettings();
  const email = settings?.contactEmail || "contact@nooressentials.com";
  const phone = settings?.contactPhone || "+92 319 0409623";
  const address = settings?.address || "Lahore, Pakistan";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setError,
    clearErrors,
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: { name: "", email: "", subject: "", message: "" },
  });

  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  const onSubmit = async (data: ContactFormValues) => {
    setSubmitStatus("idle");
    clearErrors("root");
    try {
      // Replace with real API call
      await new Promise((r) => setTimeout(r, 800));
      setSubmitStatus("success");
      reset();
    } catch {
      setSubmitStatus("error");
      setError("root", { message: "Something went wrong. Please try again." });
    }
  };

  return (
    <>
      <Container noPadding className="py-2 md:py-4">
        <h1 className="text-3xl font-bold text-[#333333] md:text-4xl">
          Contact Us
        </h1>
        <p className="mt-2 text-[#333333]/80">
          Get in touch with the {settings?.appName || "Noor Essentials"} team. We&apos;d love to hear from you.
        </p>

        {/* Form 60% + Info 40% */}
        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_1fr] lg:gap-16 xl:grid-cols-[3fr_2fr]">
          {/* Left: Form */}
          <div className="lg:col-span-1">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-6 rounded-xl border border-[#333333]/10 bg-white p-6 shadow-sm md:p-8"
            >
              <div>
                <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-[#333333]">
                  Name
                </label>
                <Input
                  id="name"
                  {...register("name")}
                  placeholder="Your name"
                  className="border-[#333333]/20 text-[#333333] placeholder:text-muted-foreground"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>
              <div>
                <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-[#333333]">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  {...register("email")}
                  placeholder="you@example.com"
                  className="border-[#333333]/20 text-[#333333] placeholder:text-muted-foreground"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>
              <div>
                <label htmlFor="subject" className="mb-1.5 block text-sm font-medium text-[#333333]">
                  Subject
                </label>
                <Input
                  id="subject"
                  {...register("subject")}
                  placeholder="Subject"
                  className="border-[#333333]/20 text-[#333333] placeholder:text-muted-foreground"
                />
                {errors.subject && (
                  <p className="mt-1 text-sm text-red-600">{errors.subject.message}</p>
                )}
              </div>
              <div>
                <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-[#333333]">
                  Message
                </label>
                <textarea
                  id="message"
                  {...register("message")}
                  rows={5}
                  placeholder="Your message..."
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-[#333333] placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#C4A747]/50"
                />
                {errors.message && (
                  <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>
                )}
              </div>
              {errors.root && (
                <p className="text-sm text-red-600">{errors.root.message}</p>
              )}
              {submitStatus === "success" && (
                <p className="text-sm font-medium text-green-600">
                  Message sent successfully. We&apos;ll get back to you soon.
                </p>
              )}
              {submitStatus === "error" && (
                <p className="text-sm text-red-600">
                  Something went wrong. Please try again.
                </p>
              )}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#C4A747] text-[#333333] hover:bg-[#C4A747]/90 sm:w-auto"
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </div>

          {/* Right: Contact info */}
          <div className="space-y-8 rounded-xl border border-[#333333]/10 bg-[#F5F3EE] p-6 md:p-8">
            <div>
              <h2 className="text-lg font-semibold text-[#333333]">Contact Info</h2>
              <ul className="mt-4 space-y-4">
                <li className="flex items-start gap-3">
                  <Mail className="mt-0.5 h-5 w-5 shrink-0 text-[#C4A747]" />
                  <a
                    href={`mailto:${email}`}
                    className="text-[#333333]/90 hover:text-[#C4A747]"
                  >
                    {email}
                  </a>
                </li>
                <li className="flex items-start gap-3">
                  <Phone className="mt-0.5 h-5 w-5 shrink-0 text-[#C4A747]" />
                  <a
                    href={`tel:${phone.replace(/\s/g, "")}`}
                    className="text-[#333333]/90 hover:text-[#C4A747]"
                  >
                    {phone}
                  </a>
                </li>
                <li className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-[#C4A747]" />
                  <span className="text-[#333333]/90">{address}</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="flex items-center gap-2 text-lg font-semibold text-[#333333]">
                <Clock className="h-5 w-5 text-[#C4A747]" />
                Working Hours
              </h3>
              <pre className="mt-2 whitespace-pre-wrap font-sans text-sm text-[#333333]/90">
                {STORE_HOURS}
              </pre>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-[#333333]">Follow Us</h3>
              <div className="mt-3 flex gap-4">
                {SOCIAL.map(({ icon: Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    aria-label={label}
                    className="rounded-full p-2 text-[#333333]/80 transition-colors hover:bg-[#C4A747]/20 hover:text-[#C4A747]"
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* FAQ accordion */}
        <section className="mt-16 max-w-3xl">
          <h2 className="text-2xl font-bold text-[#333333]">Frequently Asked Questions</h2>
          <Accordion type="single" collapsible className="mt-6 w-full">
            {FAQ_ITEMS.map(({ q, a }, i) => (
              <AccordionItem key={i} value={`faq-${i}`}>
                <AccordionTrigger className="text-left">{q}</AccordionTrigger>
                <AccordionContent className="text-[#333333]/80">{a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        {/* Map removed per request */}
      </Container>
    </>
  );
}

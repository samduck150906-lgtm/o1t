const FAQPageJsonLd = ({ faq }: { faq: { question: string; answer: string }[] }) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faq.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  })),
});

export function FAQJsonLd({ faq }: { faq: { question: string; answer: string }[] }) {
  const jsonLd = FAQPageJsonLd({ faq });
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

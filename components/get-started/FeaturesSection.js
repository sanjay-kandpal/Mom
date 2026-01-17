import FeatureCard from "./FeatureCard";

export default function FeaturesSection() {
  const features = [
    {
      icon: "cloud_off",
      title: "Zero Uploads",
      description:
        "Files are processed directly in memory. Your sensitive meeting recordings never leave your machine.",
    },
    {
      icon: "auto_awesome",
      title: "AI-Powered",
      description:
        "Whisper & LLMs run entirely within your browser for smart, structured transcription and summarization.",
    },
    {
      icon: "hard_drive",
      title: "Local Storage",
      description:
        "AI models are cached in your browser for offline use. No constant downloading required.",
    },
  ];

  return (
    <div className="flex flex-col gap-10 py-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <FeatureCard
            key={index}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
          />
        ))}
      </div>
    </div>
  );
}

interface TestimonialCardProps {
  name: string;
  position: string;
  testimonial: string;
  rating: number;
}

export default function TestimonialCard({ name, position, testimonial, rating }: TestimonialCardProps) {
  return (
    <div className="bg-white rounded-lg border border-silver/20 p-6 hover-lift transition-all duration-300 animate-fade-in">
      {/* Stars */}
      <div className="flex mb-4">
        {[...Array(5)].map((_, i) => (
          <svg key={i} className={`w-5 h-5 ${i < rating ? "text-gold" : "text-silver/30"}`} fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>

      {/* Testimonial */}
      <blockquote className="text-navy mb-4 text-pretty italic">"{testimonial}"</blockquote>

      {/* Author */}
      <div>
        <div className="font-bold text-navy">{name}</div>
        <div className="text-silver text-sm">{position}</div>
      </div>
    </div>
  );
}

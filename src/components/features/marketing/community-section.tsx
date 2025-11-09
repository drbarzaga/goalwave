import { Avatar, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";

const mainContributors = [
  {
    name: "Jose Barzaga",
    href: "https://github.com/meschacirung",
    image: "https://randomuser.me/api/portraits/men/1.jpg",
  },
  {
    name: "Marcelo Pérez",
    href: "https://github.com/meschacirung",
    image: "https://randomuser.me/api/portraits/men/2.jpg",
  },
  {
    name: "David Haz",
    href: "https://github.com/meschacirung",
    image: "https://randomuser.me/api/portraits/men/3.jpg",
  },
  {
    name: "Jhey",
    href: "https://github.com/meschacirung",
    image: "https://randomuser.me/api/portraits/men/4.jpg",
  },
  {
    name: "Carlos Mejía",
    href: "https://github.com/meschacirung",
    image: "https://randomuser.me/api/portraits/men/5.jpg",
  },
  {
    name: "Juan Pablo Mejía",
    href: "https://github.com/meschacirung",
    image: "https://randomuser.me/api/portraits/men/6.jpg",
  },
  {
    name: "Miguel Angel Pérez",
    href: "https://github.com/meschacirung",
    image: "https://randomuser.me/api/portraits/men/7.jpg",
  },
  {
    name: "Jose Angel Mejía",
    href: "https://github.com/meschacirung",
    image: "https://randomuser.me/api/portraits/men/8.jpg",
  },
  {
    name: "Carlos Fuentes",
    href: "https://github.com/meschacirung",
    image: "https://randomuser.me/api/portraits/men/9.jpg",
  },
  {
    name: "Juan Pablo Fuentes",
    href: "https://github.com/meschacirung",
    image: "https://randomuser.me/api/portraits/men/10.jpg",
  },
  {
    name: "Cintia Pérez",
    href: "https://github.com/meschacirung",
    image: "https://randomuser.me/api/portraits/men/11.jpg",
  },
  {
    name: "Nadia Pérez",
    href: "https://github.com/meschacirung",
    image: "https://randomuser.me/api/portraits/men/12.jpg",
  },
];

export default function CommunitySection() {
  return (
    <section className="py-16 md:py-32">
      <div className="mx-auto max-w-5xl px-6">
        <div className="text-center">
          <h2 className="text-balance text-4xl font-semibold lg:text-5xl">
            Built by the Community <br /> for the Community
          </h2>
          <p className="mt-6">
            Harum quae dolore orrupti aut temporibus ariatur.
          </p>
        </div>
        <div className="mx-auto mt-12 flex max-w-lg flex-wrap justify-center gap-3">
          {mainContributors.map((contributor) => (
            <Link
              key={contributor.name}
              href={contributor.href}
              target="_blank"
              title={contributor.name}
              className="size-16 rounded-full border *:size-full *:rounded-full *:object-cover"
            >
              <Avatar>
                <AvatarImage src={contributor.image} alt={contributor.name} />
              </Avatar>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

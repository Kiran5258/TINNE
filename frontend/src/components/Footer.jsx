import { Link } from "react-router-dom";
import { footerMenu } from "../constants/footer";
import { Icons } from "../constants/icons";
const { InstagramIcon, FacebookIcon, ArrowUpIcon } = Icons;

export default function Footer() {
  const { about, shop, quickLinks, contact } = footerMenu;

  return (
    <footer className="w-full border-t bg-white mt-20">
      <div className="max-w-[1400px] mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-4 gap-14">

        {/* ABOUT SECTION */}
        <div>
          <h3 className="text-xl font-semibold mb-4">{about.title}</h3>
          <p className="text-gray-600">{about.description}</p>
        </div>

        {/* SHOP */}
        <div>
          <h3 className="text-xl font-semibold mb-4">{shop.title}</h3>
          <ul className="space-y-2">
            {shop.items.map((item, i) => (
              <li key={i}>
                <Link className="text-gray-700 hover:text-black" to={item.path}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* QUICK LINKS */}
        <div>
          <h3 className="text-xl font-semibold mb-4">{quickLinks.title}</h3>
          <ul className="space-y-2">
            {quickLinks.items.map((item, i) => (
              <li key={i}>
                <Link className="text-gray-700 hover:text-black" to={item.path}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* CONTACT */}
        <div>
          <h3 className="text-xl font-semibold mb-4">{contact.title}</h3>

          <p className="text-gray-700">{contact.email}</p>
          <p className="text-gray-700 mt-2">{contact.phone1}</p>
          <p className="text-gray-700">{contact.phone2}</p>

          <div className="flex space-x-4 mt-5">
            <a href={contact.socials.facebook} target="_blank">
              <FacebookIcon className="w-6 h-6 cursor-pointer hover:opacity-70" />
            </a>

            <a href={contact.socials.instagram} target="_blank">
              <InstagramIcon className="w-6 h-6 cursor-pointer hover:opacity-70" />
            </a>
          </div>
        </div>
      </div>

      {/* BACK TO TOP BUTTON */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-6 right-6 bg-black text-white p-3 rounded-full shadow-xl hover:opacity-80 transition"
      >
        <ArrowUpIcon className="w-5 h-5" />
      </button>
    </footer>
  );
}

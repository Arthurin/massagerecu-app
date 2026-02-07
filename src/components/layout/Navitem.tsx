import Link from "next/link";

export default function NavItem({
  url,
  title,
  isActive,
}: {
  url: string;
  title: string;
  isActive: boolean;
}) {
  return (
    <>
      {title === "Réserver" ? (
        <li id="reserver-item" className="nav-item">
          <Link
            href={url}
            aria-current={isActive ? "page" : undefined}
            className={`btn ${
              isActive ? "btn-outline-primary" : "btn-primary"
            } me-2 btnMenuCustom ms-lg-2 mt-2 mt-lg-0`}
          >
            Réserver
          </Link>
        </li>
      ) : (
        <li className="nav-item">
          <Link
            href={url}
            aria-current={isActive ? "page" : undefined}
            className={`nav-link ${isActive ? "active" : ""}`}
          >
            {title}
          </Link>
        </li>
      )}
    </>
  );
}

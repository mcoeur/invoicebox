import Link from "next/link";
import { useTranslations } from "next-intl";

export default function Home() {
  const t = useTranslations("home");

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">
            {t("title")}
          </h1>
          <p className="text-xl text-gray-600 mb-12">{t("subtitle")}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link
            href="/clients"
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="text-center">
              <div className="text-3xl mb-4">👥</div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                {t("cards.clients.title")}
              </h2>
              <p className="text-gray-600">{t("cards.clients.description")}</p>
            </div>
          </Link>

          <Link
            href="/documents"
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="text-center">
              <div className="text-3xl mb-4">📄</div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                {t("cards.documents.title")}
              </h2>
              <p className="text-gray-600">
                {t("cards.documents.description")}
              </p>
            </div>
          </Link>

          <Link
            href="/profile"
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="text-center">
              <div className="text-3xl mb-4">⚙️</div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                {t("cards.profile.title")}
              </h2>
              <p className="text-gray-600">{t("cards.profile.description")}</p>
            </div>
          </Link>

          <Link
            href="/settings"
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="text-center">
              <div className="text-3xl mb-4">🔢</div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                {t("cards.settings.title")}
              </h2>
              <p className="text-gray-600">{t("cards.settings.description")}</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

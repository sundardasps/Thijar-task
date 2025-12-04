import { Suspense, lazy } from "react";

const CategoryContainer = lazy(() =>
  import("../components/pos/Category/CategoryContainer")
);
const SalesContainer = lazy(() =>
  import("../components/pos/Sales/SalesContainer")
);
const DetailsContainer = lazy(() =>
  import("../components/pos/Details/DetailsContainer")
);
const Controlles = lazy(() => import("../components/pos/common/Controllers"));

export default function Dashboard() {
  return (
    <div className="lg:flex min-h-screen">
      <Suspense fallback={<Loader />}>
        <SalesContainer />
      </Suspense>

      <div className="flex flex-col w-full">
        <div className="flex w-full">
          <Suspense fallback={<Loader />}>
            <CategoryContainer />
          </Suspense>

          <Suspense fallback={<Loader />}>
            <DetailsContainer />
          </Suspense>
        </div>

        <Suspense fallback={<Loader />}>
          <Controlles />
        </Suspense>
      </div>
    </div>
  );
}

function Loader() {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-sky-500" />
    </div>
  );
}

import { CategoriesSection } from "../sections/categories-section";

interface HomeViewProps {
  categoryId?: string;
}
export const HomeView = ({ categoryId }: HomeViewProps) => {
  return (
    <div className="max-w-[2400px] mx-auto mb-10 px-4 flex flex-col pt-2.5 gap-y-6 ">
      <CategoriesSection categoryId={categoryId} />
    </div>
  );
};

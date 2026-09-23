import Category from "@/components/frontpage/Category";

interface CategoryPageProps {
    params: Promise<{ id: string }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
    const { id } = await params;

    return <Category categoryId={id} />;
}
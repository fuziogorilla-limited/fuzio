import Product from "@/components/frontpage/Product";

interface ProductPageProps {
    params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
    const { id } = await params;

    return <Product productId={id} />;
}
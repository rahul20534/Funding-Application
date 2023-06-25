import { server } from "@/config/index";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import styles from "@/styles/HoverCard.module.css";
import dbConnect from "@/utils/dbConnect";
import Category from "@/models/category";

function CategoryCard({ name, imageUrl, categoryId }) {
  return (
    <div className="col">
      <div className={`card ${styles.cardhover}`}>
        <div className="card-header">{name}</div>
        <Image
          src={imageUrl}
          className="card-img-top"
          alt="category pic"
          width={500}
          height={300}
        />
        <div className="card-body">
          <Link
            href={`/donations/${categoryId}/payment`}
            className="btn btn-primary"
          >
            Donate now
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function CategoryPage({ categories }) {
  // console.log("categories inside CategoryPage element = ", categories);
  return (
    // <div className="col-sm-12 col-md-8 col-xxl-6 ps-5">
    <div className="row row-cols-sm-1 rows-cols-lg-2 row-cols-xxl-4 g-4">
      {categories.map((category) => (
        <CategoryCard
          key={category.id}
          name={category.name}
          imageUrl={category.imageUrl}
          categoryId={category.id}
        />
      ))}
    </div>
    // </div>
  );
}

export async function getServerSideProps(context) {
  var categories;
  try {
    await dbConnect();
    categories = await Category.find();
    // console.log("categories just after fetching = ", categories);

    categories = categories.map((category) =>
      category.toObject({ getters: true })
    );
    // console.log("categories after using toObject = ", categories);

    // categories = await categories.json();
    // console.log("categories after using json = ", categories);
  } catch (error) {
    console.log(error);
  }

  // const res = await fetch(`${server}/api/category`);
  // const { data: categories } = await res.json();
  // console.log("categories inside getserversideprops = ", categories);

  categories.map((category) => {
    const isImageLocal = category.imageUrl.slice(0, 6) === "public";
    const newImage = category.imageUrl.replaceAll("\\", "/");
    category.imageUrl = isImageLocal ? newImage.slice(6) : newImage;
  });

  // console.log("data = ", categories);
  // console.log("type of categories = ", typeof(categories))

  return {
    props: {
      categories: JSON.parse(JSON.stringify(categories)),
      // categories,
    },
  };
}

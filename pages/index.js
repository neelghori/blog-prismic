import React from "react";
import { client } from "./apollo-client";
import gql from "graphql-tag";
import { RichText } from "prismic-reactjs";
import Image from "next/image";
export default function Home() {
  const [data, setuserData] = React.useState({});
  React.useEffect(() => {
    client
      .query({
        query: gql`
          query ($Uid: String!) {
            allBlog_banners(uid: $Uid, lang: "en-in") {
              edges {
                node {
                  blog_details
                  blog_heading
                  _linkType
                  body {
                    ... on Blog_bannerBodyAlternate_grid {
                      type
                      label
                      primary {
                        eyebrow_headline
                        title
                        description
                        optional_image
                        image_side
                      }
                      fields {
                        optional_icon
                        title
                        description
                      }
                    }
                  }
                }
              }
            }
            blogtitles(uid: $Uid, lang: "en-in") {
              something
              blogTitle
              body {
                ... on BlogtitlesBodyBlogCardss {
                  type
                  label
                  primary {
                    blogcardtitle
                  }
                }
              }
            }
          }
        `,
        variables: {
          Uid: "1",
        },
      })
      .then((response) => {
        setuserData((prev) => {
          return { ...prev, ...response.data };
        });
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);
  console.log(data.allBlog_banners?.edges[0].node.body[0].fields);
  return (
    <div>
      <h2>{RichText.asText(data.blogtitles?.something)}</h2>
      {RichText.asText(data.blogtitles?.blogTitle)}
      <div>
        {RichText.asText(data.blogtitles?.body[0]?.primary.blogcardtitle)}
      </div>
      <div>
        {RichText.asText(data.allBlog_banners?.edges[0].node.blog_details)}
      </div>
      <div>
        {RichText.asText(data.allBlog_banners?.edges[0].node.blog_heading)}
      </div>
      {data.allBlog_banners?.edges[0].node.body[0].fields.map((e) => {
        return (
          <div>
            <h1>{RichText.asText(e.title)}</h1>
            <p>{RichText.asText(e.description)}</p>
            <Image
              src={e.optional_icon.url}
              width={"200px"}
              height={"300px"}
              style={{ textAlign: e.image_side }}
            />
          </div>
        );
      })}
    </div>
  );
}

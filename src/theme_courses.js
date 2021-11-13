import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Layout, PageHeader, Descriptions, List, Button, Menu, Tooltip } from "antd";
import { StarOutlined, CommentOutlined, NotificationOutlined } from "@ant-design/icons";
import "./theme_courses.css";
import { notifs_sample, posts_sample } from "./App";
import { CardListItem } from "./theme_posts";
const {
  Content
} = Layout; // General layout of a coursepage

function CoursePage() {
  const {
    courseid
  } = useParams();
  const [course, setCourse] = useState(null);
  const posts = findPosts(courseid);
  const notifs = findNotifs(courseid);
  useEffect(() => {
    async function findCourse() {
      const resp = await fetch("/courses/info", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "course_id": courseid
        })
      });
      const course = await resp.json();

      if (course["course_id"] !== "") {
        setCourse({
          course_id: course["course_id"],
          course_name: course["course_name"],
          credit: course["credit"],
          workload: course["workload"],
          prerequisites: course["prerequisites"],
          lecturer_id: course["lecturer_id"],
          lecturer_name: course["lecturer_name"],
          open_semesters: course["open_semesters"],
          description: course["description"],
          rating: course["rating"]
        });
      } else {
        setCourse(null);
      }
    }

    findCourse();
  }, [courseid]);

  if (course === null) {
    return null;
  } else {
    return /*#__PURE__*/React.createElement(Layout, {
      className: "coursepage-layout"
    }, /*#__PURE__*/React.createElement(Content, null, /*#__PURE__*/React.createElement(CourseHeader, {
      id: course.course_id,
      name: course.course_name
    }), /*#__PURE__*/React.createElement(CourseDesciptions, {
      course: course
    }), /*#__PURE__*/React.createElement(CoursePostsAndNotifs, {
      posts: posts,
      notifs: notifs
    })));
  }
}

function findNotifs(courseid) {
  const notifs = [];

  for (var i = 0; i < notifs_sample.length; i++) {
    if (notifs_sample[i].course_id === courseid) {
      notifs.push(notifs_sample[i]);
    }
  }

  return notifs;
}

function findPosts(courseid) {
  const posts = [];

  for (var i = 0; i < posts_sample.length; i++) {
    if (posts_sample[i].course_id === courseid) {
      posts.push(posts_sample[i]);
    }
  }

  return posts;
}

function CourseHeader(props) {
  return /*#__PURE__*/React.createElement(PageHeader, {
    ghost: false,
    onBack: () => window.history.back(),
    title: /*#__PURE__*/React.createElement("span", null, props.id),
    subTitle: /*#__PURE__*/React.createElement("span", null, props.name),
    extra: [/*#__PURE__*/React.createElement(Tooltip, {
      key: `${props.id}-favor`,
      title: "Favor this course"
    }, /*#__PURE__*/React.createElement(StarOutlined, null))],
    className: "coursepage-header"
  });
}

function CourseDesciptions(props) {
  const course = props.course;
  return /*#__PURE__*/React.createElement(Descriptions, {
    column: 2,
    bordered: true,
    labelStyle: {
      background: "#ffffff",
      fontSize: "16px"
    },
    contentStyle: {
      background: "#fafafa"
    }
  }, /*#__PURE__*/React.createElement(Descriptions.Item, {
    label: "Open Semester",
    span: 2
  }, course.open_semesters), /*#__PURE__*/React.createElement(Descriptions.Item, {
    label: "Lecturer",
    span: 2
  }, course.lecturer_name), /*#__PURE__*/React.createElement(Descriptions.Item, {
    label: "Module Credit"
  }, course.credit), /*#__PURE__*/React.createElement(Descriptions.Item, {
    label: "Workload"
  }, course.workload), /*#__PURE__*/React.createElement(Descriptions.Item, {
    label: "Prerequisites",
    span: 2
  }, /*#__PURE__*/React.createElement(List, {
    dataSource: course.prerequisites,
    renderItem: item => /*#__PURE__*/React.createElement(Link, {
      to: `/courses/${item}`
    }, /*#__PURE__*/React.createElement(Button, {
      type: "text"
    }, " ", item, " "))
  })), /*#__PURE__*/React.createElement(Descriptions.Item, {
    label: "Description",
    span: 2
  }, course.description));
}

function CoursePostsAndNotifs(props) {
  const [display, setDisplay] = useState("notifs");
  const DropdownList = display === "notifs" ? /*#__PURE__*/React.createElement(List, {
    itemLayout: "vertical",
    size: "large",
    dataSource: props.notifs,
    renderItem: item => /*#__PURE__*/React.createElement(NotifListItem, {
      item: item
    }),
    pagination: {
      onchange: page => {
        console.log(page);
      },
      pageSize: 5,
      total: props.notifs.length,
      style: {
        textAlign: "center"
      }
    },
    className: "coursepage-notifs"
  }) : /*#__PURE__*/React.createElement(List, {
    itemLayout: "vertical",
    dataSource: props.posts,
    renderItem: item => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement(CardListItem, {
      item: item
    })),
    pagination: {
      onchange: page => {
        console.log(page);
      },
      pageSize: 3,
      total: props.posts.length,
      style: {
        textAlign: "center"
      }
    },
    className: "coursepage-posts"
  });

  function displayPosts() {
    setDisplay("posts");
  }

  function displayNotifs() {
    setDisplay("notifs");
  }

  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Menu, {
    mode: "horizontal",
    defaultSelectedKeys: ["notifs"],
    className: "coursepage-options"
  }, /*#__PURE__*/React.createElement(Menu.Item, {
    key: "notifs",
    icon: /*#__PURE__*/React.createElement(NotificationOutlined, null),
    onClick: displayNotifs
  }, "Notifications"), /*#__PURE__*/React.createElement(Menu.Item, {
    key: "posts",
    icon: /*#__PURE__*/React.createElement(CommentOutlined, null),
    onClick: displayPosts
  }, "Course Posts")), DropdownList);
}

function NotifListItem(props) {
  let item = props.item;
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement(List.Item, {
    key: item.post_id,
    className: "coursepage-notifs-item"
  }, /*#__PURE__*/React.createElement(List.Item.Meta, {
    title: item.title,
    description: `Posted by ${item.author_name}, ${item.date}`
  }), /*#__PURE__*/React.createElement("span", null, item.content)));
}

export { CoursePage };
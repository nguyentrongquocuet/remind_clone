import React from "react";
import { NavLink, useHistory } from "react-router-dom";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";

import "./Sidebar.scss";
const sidebarActions = [
  {
    name: "Overall",
    path: "/admin/overall",
    image: "overall.svg",
  },
  {
    name: "Create",
    path: "/admin/new",
    image: "new.svg",
    children: [
      {
        name: "user",
        path: "/user",
      },
      {
        name: "class",
        path: "/class",
      },
    ],
  },
  {
    name: "Users Manage",
    path: "/admin/users",
    image: "users.svg",
  },
  {
    name: "Classes Manage",
    path: "/admin/classes",
    image: "classes.svg",
  },
  {
    name: "Support Manage",
    path: "support",
    image: "supports.svg",
  },
  {
    name: "Traffic Manage",
    path: "traffic",
    image: "traffic.svg",
  },
  {
    name: "System Preferences",
    path: "preferences",
    image: "setting.svg",
  },
];

const toggleExpand = (e) => {
  document.getElementById("admin-vertical-sidebar-expand-checkbox").click();
};

const AdminSidebar = () => {
  const history = useHistory();
  return (
    <div className="admin-vertical-sidebar">
      <input type="checkbox" id="admin-vertical-sidebar-expand-checkbox" />
      {sidebarActions.map((action, key) => {
        if (action.children) {
          return (
            <>
              <div
                title={action.name}
                key={key}
                className="admin-vertical-sidebar__action"
                onClick={(e) => !action.children && history.push(action.path)}
              >
                {action.image && (
                  <img
                    className="medium"
                    src={`/assets/Admin/${action.image}`}
                    alt={action.name}
                  />
                )}
                <span className="admin-vertical-sidebar__action__name">
                  {action.name}
                </span>
                {action.children && (
                  <div className="admin-vertical-sidebar__action__children">
                    {action.children.map((child, i) => {
                      return (
                        <span
                          key={i}
                          onClick={(e) =>
                            history.push(action.path + child.path)
                          }
                        >
                          {action.name + " " + child.name}
                        </span>
                      );
                    })}
                  </div>
                )}
              </div>
            </>
          );
        }
        return (
          <>
            <NavLink
              title={action.name}
              key={key}
              className="admin-vertical-sidebar__action"
              onClick={(e) => !action.children && history.push(action.path)}
              to={action.path && !action.children ? action.path : "#"}
              activeClassName="active"
            >
              {action.image && (
                <img
                  className="medium"
                  src={`/assets/Admin/${action.image}`}
                  alt={action.name}
                />
              )}
              <span className="admin-vertical-sidebar__action__name">
                {action.name}
              </span>
              {action.children && (
                <div className="admin-vertical-sidebar__action__children">
                  {action.children.map((child, i) => {
                    return (
                      <span
                        key={i}
                        onClick={(e) => history.push(action.path + child.path)}
                      >
                        {action.name + " " + child.name}
                      </span>
                    );
                  })}
                </div>
              )}
            </NavLink>
          </>
        );
      })}

      <ChevronLeftIcon onClick={toggleExpand} color="primary" />
    </div>
  );
};

export default AdminSidebar;

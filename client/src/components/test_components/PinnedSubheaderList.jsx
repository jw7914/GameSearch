import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";

export default function PinnedSubheaderList() {
  return (
    <List
      sx={{
        width: "100%",
        maxWidth: 360,
        bgcolor: "background.paper",
        position: "relative",
        overflow: "auto",
        maxHeight: 300,
        margin: "auto",
        textAlign: "center", // Center the text globally
        justifyContent: "center", // Center list contents
        "& ul": { padding: 0 },
      }}
      subheader={<li />}
    >
      {[0, 1, 2, 3, 4].map((sectionId) => (
        <li key={`section-${sectionId}`} style={{ listStyle: "none" }}>
          <ul style={{ padding: 0 }}>
            <ListSubheader
              sx={{
                display: "flex",
                justifyContent: "center", // Center the subheader
              }}
            >
              {`I'm sticky ${sectionId}`}
            </ListSubheader>
            {[0, 1, 2].map((item) => (
              <ListItem
                key={`item-${sectionId}-${item}`}
                sx={{
                  display: "flex",
                  justifyContent: "center", // Center each list item
                }}
              >
                <ListItemText
                  primary={`Item ${item}`}
                  sx={{ textAlign: "center" }} // Center the text inside each item
                />
              </ListItem>
            ))}
          </ul>
        </li>
      ))}
    </List>
  );
}

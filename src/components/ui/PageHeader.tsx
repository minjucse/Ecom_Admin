
import { Paper, Typography} from "@mui/material";
import { makeStyles } from "@mui/styles";

type TPageHeaderProps ={
  title: string;
  subTitle: string;
}

const useStyles = makeStyles(() => ({
  root: {
    backgroundColor: "#FCFCFC",
  },
  pageHeader: {
    padding: '20px 32px',
    display: "flex",
    color: "#6691B1",
  },
  pageTitle: {
    "& .MuiTypography-subtitle2": {
      color: "rgba(0, 0, 0, 0.87)",
      opacity: "0.6",
    },
  },
}));

const PageHeader = ({ title, subTitle }: TPageHeaderProps) => {
  const classes = useStyles();

  return (
    <Paper elevation={0} square className={classes.root}>
      <div className={classes.pageHeader}>
        <div className={classes.pageTitle}>
          <Typography variant="h6" component="div">
            {title}
          </Typography>
          <Typography variant="subtitle2" component="div">
            {subTitle}
          </Typography>
        </div>
      </div>
    </Paper>
  );
};

export default PageHeader;

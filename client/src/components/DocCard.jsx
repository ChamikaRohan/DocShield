import * as React from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Logo_Information_Security from '../assets/Logo_Information_Security.png';
import DownloadForOfflineIcon from '@mui/icons-material/DownloadForOffline';

import DeleteIcon from '@mui/icons-material/Delete';


// interface ExpandMoreProps extends IconButtonProps {
//   expand: boolean;
// }

const ExpandMore = styled((props) => {
    const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme }) => ({
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
  variants: [
    {
      props: ({ expand }) => !expand,
      style: {
        transform: 'rotate(0deg)',
      },
    },
    {
      props: ({ expand }) => !!expand,
      style: {
        transform: 'rotate(180deg)',
      },
    },
  ],
}));

export default function DocCard() {
  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Card sx={{ maxWidth: 230,maxHeight: 365,  transition: 'transform 0.3s, box-shadow 0.3s','&:hover': { transform: 'scale(1.05)', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)' }}}>
      <CardHeader sx={{  maxHeight: '25px',
        fontFamily: 'Lato, sans-serif',
        '& .MuiCardHeader-title': {
          fontFamily: 'Lato, sans-serif',
        },
        '& .MuiCardHeader-subheader': {
          fontFamily: 'Lato, sans-serif',
        },}}
        avatar={
          <IconButton sx={{ bgcolor: 'coral',maxHeight:'35px',maxWidth:'35px' }} aria-label="settings">
            <ArticleOutlinedIcon  sx={{ fontSize: '15px'}}/>
          </IconButton>
        }
        
        title="Chamika Rohan" 
        subheader="September 14, 2016" 
        
      />
      <CardMedia sx={{ maxHeight:'100px' }}
        component="img"
        height="100"
        image={Logo_Information_Security}
        alt="document"
      />
      <CardContent>
        <Typography variant="body2" sx={{ color: 'text.secondary' ,maxHeight:'5px',fontFamily:'lato'}}>
          Your message goes here
        </Typography>
      </CardContent >
      <CardActions  sx={{ justifyContent:'center',gap:'10px',maxHeight:'35px'}}>
        <IconButton aria-label="add to favorites" sx={{  fontSize: '100px' ,color: '#5ABF64' ,transition: 'transform 0.3s, box-shadow 0.3s','&:hover': { transform: 'scale(1.1)', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)' }}}>
          <DownloadForOfflineIcon sx={{ fontSize: '30px' }} />
        </IconButton>
        <IconButton aria-label="share" sx={{ color: '#CC2F25',opacity:'70%',transition: 'transform 0.3s, box-shadow 0.3s','&:hover': { transform: 'scale(1.1)', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)' } }}>
          <DeleteIcon sx={{ fontSize: '30px' }}/>
        </IconButton>
        
      </CardActions>
      
    </Card>
  );
}
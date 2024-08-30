
import { Card, CardContent, Typography, CardMedia } from '@mui/material';

const SerieCard = () => {
  return (
    <Card>
      <CardMedia
        component="img"
        height="140"
        image="https://via.placeholder.com/150"
        alt="Event Image"
      />
      <CardContent>
        <Typography variant="h6">Event Title</Typography>
        <Typography variant="body2" color="textSecondary">Event Description</Typography>
      </CardContent>
    </Card>
  );
};

export default SerieCard;

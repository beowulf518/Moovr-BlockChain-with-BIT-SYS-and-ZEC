import React from 'react';
import { connect } from 'react-redux';

// redux
import { doCategoryReq } from '../../redux/actions/store/category';
import { doCurrencyReq } from '../../redux/actions/store/currency';
import { doItemCreate, showSnackbar } from '../../redux/actions/store/new_item';
import { setRecord, deleteRecord, setOfferForm, updateSubtitles, setDuration } from '../../redux/actions/video';
import { setImage, deleteImage, proceed } from '../../redux/actions/image';

// components
import { Row, Col, Grid, Button } from 'react-bootstrap';
import CircularProgress from 'material-ui/CircularProgress';
import VideoRecord from './VideoRecord';
import VideoRecord2 from './VideoRecord2';
import VideoPlayer from './VideoPlayer';
import ImageEdit from './ImageEdit';
import SubtitlesEditer from './SubtitlesEditer';
import OfferForm from './OfferForm';

const newItemStyle = {
  loadingDiv: {
    marginTop: '30vh',
    textAlign: 'center',
  },
};

class NewItem extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      RecordRTC: false
    }
    this.showOfferForm = this.showOfferForm.bind(this);
  }

  componentWillMount() {
    this.props.getCategories();
    this.props.getCurrencies();

    if (navigator.mediaDevices) {
      this.setState({
        RecordRTC: true
      });
    }
  }

  showOfferForm(){
      console.log("called");
    return (
        <Grid>
          <OfferForm
            categories={this.props.categories}
            currencies={this.props.currencies}
            newItem={this.props.newItem}
            onCreate={this.props.onCreate}
            showSnackbar={this.props.showSnackbar}
            urlVideo={this.props.video.url}
            urlImage={this.props.image.data.location}
            subtitlesVideo={this.props.video.subtitles}
          />
        </Grid>
    );
  }
  render() {
    if (!this.props.image.error) {
        console.log("data image", this.props.image.data)
    }
    if (this.props.video.loading || this.props.image.loading) {
        return (
            <Grid>
              <Row>
                <Col xs={12} style={newItemStyle.loadingDiv}>
                  <center>
                    <CircularProgress size={100} thickness={6} />
                  </center>
                </Col>
              </Row>
            </Grid>
        );
    }
    if (this.props.video.videoUploaded){
        return this.showOfferForm();
    }
    if (this.props.image.proceed && this.props.image.loaded) {
        return this.showOfferForm();
    }
    if(this.props.image.loaded && !this.props.image.proceed) {
        return(
            <Grid>
                <center>
                    <ImageEdit
                        image_url={this.props.image.data.location}
                        onDelete={this.props.onDeleteImage}
                        onProceed={this.props.onProceed}
                    />
                </center>
            </Grid>
        )
    }
    if (!this.props.video.recorded || this.props.video.error) {
      return (
        <Grid>
          {this.state.RecordRTC &&
               <VideoRecord onRecorded={this.props.onRecorded} imageUploaded={this.props.imageUploaded} image={this.props.image}/>}
          {!this.state.RecordRTC && <VideoRecord2 onRecorded={this.props.onRecorded}
          imageUploaded={this.props.imageUploaded}
          />}
        </Grid>
      );
    }
    return (
      <Grid>
        <VideoPlayer
          url={this.props.video.localUrl}
          image={this.props.image.data}
          onDelete={this.props.onDelete}
          subtitles={this.props.video.subtitles}
          setDuration={this.props.setDuration}
        />
        <SubtitlesEditer
          subtitles={this.props.video.subtitles}
          onSave={this.props.onSave}
          onCancel={this.props.onDelete}
          updateSubtitles={this.props.updateSubtitles}
          videoDuration={this.props.video.videoDuration}
        />
      </Grid>
    );
  }
}

function mapStateToProps(state) {
  const image = state.image;
  const video = state.video;
  const categories = state.categories;
  const currencies = state.currencies;
  const newItem = state.newItem;

  return { image, video, categories, currencies, newItem };
}

function mapDispatchToProps(dispatch) {
  return {
    imageUploaded: (data) => {
      dispatch(setImage(data));
    },
    onRecorded: (data, url) => {
      dispatch(setRecord(data, url));
    },
    onDelete: () => {
      dispatch(deleteRecord());
    },
    onDeleteImage: () => {
        dispatch(deleteImage());
    },
    onSave: () => {
      dispatch(setOfferForm());
    },
    onCreate: (data) => {
      dispatch(doItemCreate(data));
    },
    onProceed: () => {
      dispatch(proceed())
    },
    showSnackbar: () => {
      dispatch(showSnackbar());
    },
    getCategories: () => {
      dispatch(doCategoryReq());
    },
    getCurrencies: () => {
      dispatch(doCurrencyReq());
    },
    updateSubtitles: (subtitle) => {
      dispatch(updateSubtitles(subtitle));
    },
    setDuration: (duration) => {
      dispatch(setDuration(duration));
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(NewItem);

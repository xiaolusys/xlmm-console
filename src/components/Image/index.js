import React, { Component } from 'react';

export class Image extends Component {

  static propTypes = {
    src: React.PropTypes.string,
    thumbnail: React.PropTypes.number,
    crop: React.PropTypes.string,
    quality: React.PropTypes.number,
    interlace: React.PropTypes.number,
  };

  static defaultProps = {
    quality: 100,
    interlace: 1,
  }

  render() {
    const { src, thumbnail, crop, quality, interlace, ...restProps } = this.props;
    const imgSrc = `${src}?imageMogr2/strip/format/jpg/quality/${quality}/interlace/${interlace}/` + (thumbnail ? `thumbnail/${thumbnail}/` : '') + (crop ? `crop/${crop}` : '');
    return (<img {...restProps} src= {imgSrc} onLoad={this.onLoad} />);
  }
}

import 'package:flutter/material.dart';

import 'circle_border_image.dart';
import 'util/link_util.dart';

class SocialIcon extends StatefulWidget {
  const SocialIcon(
      {Key key,
      this.socialIconSize,
      this.icon,
      this.socialUrl,
      this.socialName})
      : super(key: key);
  final socialIconSize;
  final icon;
  final socialUrl;
  final socialName;
  @override
  _SocialIconState createState() => _SocialIconState();
}

class _SocialIconState extends State<SocialIcon> {
  var innerColor;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsets.all(16),
      child: MouseRegion(
        onEnter: (onHover) {
          setState(() {
            innerColor = Colors.white30;
          });
        },
        onExit: (onHover) {
          setState(() {
            innerColor = Colors.transparent;
          });
        },
        child: InkWell(
          onTap: () {
            UrlUtil.openLink(widget.socialUrl, widget.socialName);
          },
          child: CircleBorderImage(
            width: widget.socialIconSize,
            height: widget.socialIconSize,
            innerColor: innerColor,
            circleColor: Colors.white,
            borderSize: 2,
            image: Icon(
              widget.icon,
              color: Colors.white,
            ),
          ),
        ),
      ),
    );
  }
}

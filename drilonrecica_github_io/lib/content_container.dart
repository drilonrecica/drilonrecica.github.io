import 'package:flutter/material.dart';

import 'show_up.dart';
import 'social_icons.dart';

enum ScreenSize { small, medium, large }

class ContentContainer extends StatefulWidget {
  const ContentContainer({Key key, @required this.screenSize})
      : super(key: key);
  final ScreenSize screenSize;
  @override
  _ContentContainerState createState() => _ContentContainerState();
}

class _ContentContainerState extends State<ContentContainer> {
  double circleAvatarMargin;
  double circleAvatarRadius;
  double socialIconSize;
  double titleMargin;
  double titleFontSize;
  double subTitleMargin;
  double subTitleFontSize;
  String subtitleText;

  _calculateSizes() {
    if (widget.screenSize == ScreenSize.small) {
      subtitleText =
          "Android App Developer,\nTech Enthusiast,\nElectronics Hobbyist";
      circleAvatarMargin = 112.0;
      circleAvatarRadius = 48.0;
      socialIconSize = 48.0;
      titleMargin = 40.0;
      titleFontSize = 32.0;
      subTitleMargin = 16.0;
      subTitleFontSize = 16.0;
    } else if (widget.screenSize == ScreenSize.medium) {
      subtitleText =
          "Android App Developer, Tech Enthusiast, Electronics Hobbyist";
      circleAvatarMargin = 112.0;
      circleAvatarRadius = 80.0;
      socialIconSize = 56.0;
      titleMargin = 48.0;
      titleFontSize = 64.0;
      subTitleMargin = 16.0;
      subTitleFontSize = 24.0;
    } else {
      subtitleText =
          "Android App Developer, Tech Enthusiast, Electronics Hobbyist";
      circleAvatarMargin = 128.0;
      circleAvatarRadius = 88.0;
      socialIconSize = 64.0;
      titleMargin = 48.0;
      titleFontSize = 88.0;
      subTitleMargin = 16.0;
      subTitleFontSize = 24.0;
    }
  }

  @override
  Widget build(BuildContext context) {
    _calculateSizes();
    return Stack(
      children: <Widget>[
        Row(
          mainAxisSize: MainAxisSize.max,
          mainAxisAlignment: MainAxisAlignment.center,
          crossAxisAlignment: CrossAxisAlignment.center,
          children: <Widget>[
            Column(
              children: <Widget>[
                Container(
                    margin: EdgeInsets.only(top: circleAvatarMargin),
                    child: ShowUp(
                      delay: 500,
                                          child: CircleAvatar(
                          radius: circleAvatarRadius,
                          backgroundImage: NetworkImage(
                              "https://avatars0.githubusercontent.com/u/6892529")),
                    )),
                Container(
                  margin: EdgeInsets.only(top: titleMargin),
                  child: ShowUp(
                    delay: 1000,
                    child: Text("I'm Drilon Reçica.",
                        textAlign: TextAlign.center,
                        style: TextStyle(
                            fontSize: titleFontSize,
                            color: Colors.white,
                            fontFamily: "Roboto",
                            fontWeight: FontWeight.bold)),
                  ),
                ),
                Container(
                  margin: EdgeInsets.only(top: subTitleMargin),
                  child: ShowUp(
                    delay: 1500,
                    child: RichText(
                      textAlign: TextAlign.center,
                      text: TextSpan(
                        style: TextStyle(
                          fontSize: subTitleFontSize,
                          fontFamily: "Roboto",
                          color: Colors.grey,
                        ),
                        children: <TextSpan>[
                          TextSpan(
                              text: subtitleText,
                              style: TextStyle(
                                  fontWeight: FontWeight.bold,
                                  fontFamily: "Roboto",
                                  color: Colors.white)),
                        ],
                      ),
                    ),
                  ),
                ),
                ShowUp(
                  delay: 2000,
                                  child: SocialIconsRow(
                    socialIconSize: socialIconSize,
                    screenSize: widget.screenSize,
                  ),
                ),
              ],
            )
          ],
        ),
      ],
    );
  }
}

import 'package:drilonrecica_github_io/content_container.dart';
import 'package:drilonrecica_github_io/social_data_util.dart';
import 'package:drilonrecica_github_io/social_icon.dart';
import 'package:flutter/material.dart';

import 'social_data.dart';

class SocialIconsRow extends StatefulWidget {
  const SocialIconsRow(
      {Key key, @required this.socialIconSize, @required this.screenSize})
      : super(key: key);
  final socialIconSize;
  final screenSize;
  @override
  _SocialIconsRowState createState() => _SocialIconsRowState();
}

class _SocialIconsRowState extends State<SocialIconsRow> {
  List<Widget> socialWidgetList = List<Widget>();

  _fillList() {
    var socialDataList =
        SocialDataUtil(widget.socialIconSize).getSocialDataList();

    for (int i = 0; i < socialDataList.length; i++) {
      SocialData socialData = socialDataList[i];
      socialWidgetList.add(SocialIcon(
        socialIconSize: socialData.socialIconSize,
        icon: socialData.icon,
        socialUrl: socialData.socialUrl,
        socialName: socialData.socialName,
      ));
    }
  }

  Widget _getCorrectRowWidgets(ScreenSize screenSize) {
    if (screenSize == ScreenSize.small) {
      return Column(
        children: <Widget>[
          Row(
            children: <Widget>[
              socialWidgetList[0],
              socialWidgetList[1],
              socialWidgetList[2],
            ],
          ),
          Row(
            children: <Widget>[
              socialWidgetList[3],
              socialWidgetList[4],
              socialWidgetList[5],
            ],
          )
        ],
      );
    } else {
      return Row(
        children: <Widget>[
          socialWidgetList[0],
          socialWidgetList[1],
          socialWidgetList[2],
          socialWidgetList[3],
          socialWidgetList[4],
          socialWidgetList[5],
        ],
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    _fillList();
    return Padding(
      padding: EdgeInsets.only(top: 32),
      child: _getCorrectRowWidgets(widget.screenSize),
    );
  }
}

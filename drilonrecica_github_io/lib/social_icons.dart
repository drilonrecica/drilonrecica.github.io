import 'content_container.dart';
import 'util/social_data_util.dart';
import 'social_icon.dart';
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
    socialWidgetList.clear();

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
    _fillList();
    var listLength = socialWidgetList.length;
    var size;
    var chunks = [];
    if (screenSize == ScreenSize.small) {
      size = 3;
    } else {
      size = 6;
    }
    for (int i = 0; i < listLength; i += size) {
      var end = (i + size < listLength) ? i + size : listLength;
      chunks.add(socialWidgetList.sublist(i, end));
    }

    for (int i = 0; i < chunks.length; i++) {}

    return Column(
      children: <Widget>[
        for (int i = 0; i < chunks.length; i++)
          Row(
            children: <Widget>[
              // for (int j = 0; j < chunks[i].length; j++) socialWidgetList[j]
              for (int j = 0; j < chunks[i].length; j++) chunks[i][j]
            ],
          )
      ],
    );
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsets.only(top: 32),
      child: _getCorrectRowWidgets(widget.screenSize),
    );
  }
}

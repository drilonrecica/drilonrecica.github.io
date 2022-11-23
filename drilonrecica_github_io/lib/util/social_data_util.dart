import '../social_data.dart';
import 'package:flutter/material.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';

class SocialDataUtil {
  List _socialDataList = List<SocialData>();

  SocialDataUtil(double socialIconSize) {
    _socialDataList.add(SocialData(
        socialIconSize: socialIconSize,
        icon: FontAwesomeIcons.github,
        socialUrl: "https://www.github.com/drilonrecica",
        socialName: "Drilon's Instagram"));
    _socialDataList.add(SocialData(
        socialIconSize: socialIconSize,
        icon: FontAwesomeIcons.stackOverflow,
        socialUrl: "https://stackoverflow.com/users/3392276",
        socialName: "Drilon's Instagram"));
    _socialDataList.add(SocialData(
        socialIconSize: socialIconSize,
        icon: Icons.email,
        socialUrl: "mailto:drilonrecica.dev@gmail.com",
        socialName: "Drilon's Instagram"));
    _socialDataList.add(SocialData(
        socialIconSize: socialIconSize,
        icon: FontAwesomeIcons.twitter,
        socialUrl: "https://twitter.com/drilonre",
        socialName: "Drilon's Instagram"));
    _socialDataList.add(SocialData(
        socialIconSize: socialIconSize,
        icon: FontAwesomeIcons.facebookF,
        socialUrl: "https://facebook.com/drilon.recica.3",
        socialName: "Drilon's Instagram"));
    _socialDataList.add(SocialData(
        socialIconSize: socialIconSize,
        icon: FontAwesomeIcons.instagram,
        socialUrl: "https://www.instagram.com/recicadrilon",
        socialName: "Drilon's Instagram"));
  }

  List<SocialData> getSocialDataList() {
    return _socialDataList;
  }
}

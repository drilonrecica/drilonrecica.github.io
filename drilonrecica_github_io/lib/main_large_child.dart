import 'package:drilonrecica_github_io/circle_border_image.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:universal_html/prefer_universal/html.dart' as html;
import 'package:font_awesome_flutter/font_awesome_flutter.dart';

class LargeBody extends StatefulWidget {
  const LargeBody({Key key}) : super(key: key);

  @override
  _LargeBodyState createState() => _LargeBodyState();
}

class _LargeBodyState extends State<LargeBody> {
  var innerColorList = [
    Colors.transparent,
    Colors.transparent,
    Colors.transparent,
    Colors.transparent,
    Colors.transparent,
    Colors.transparent
  ];
  var circleColor = Colors.white;
  var flutterLinkTextDecoration = TextDecoration.none;

  _launchURL(String url) async {
    if (await canLaunch(url)) {
      await launch(url);
    } else {
      throw 'Could not launch $url';
    }
  }

  _openLink(String url, String name) {
    if (kIsWeb) {
      html.window.open(url, name);
    } else {
      _launchURL(url);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: <Widget>[
        Row(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: <Widget>[
              Expanded(
                flex: 1,
                child: Image.asset(
                  "assets/images/prishtina.jpg",
                  fit: BoxFit.cover,
                ),
              )
            ]),
        Container(
          color: Color.fromRGBO(0, 0, 0, 0.60),
        ),
        Padding(
          padding: EdgeInsets.all(32),
          child: Align(
            alignment: Alignment.bottomRight,
            child: MouseRegion(
              onEnter: (onHover) {
                setState(() {
                  flutterLinkTextDecoration = TextDecoration.underline;
                });
              },
              onExit: (onHover) {
                setState(() {
                  flutterLinkTextDecoration = TextDecoration.none;
                });
              },
              child: InkWell(
                onTap: () {
                  _openLink("https://flutter.dev/web", "");
                },
                child: Text(
                  "Made with Flutter Web",
                  style: TextStyle(
                    color: Colors.white,
                    fontFamily: "Roboto",
                    fontWeight: FontWeight.bold,
                    decoration: flutterLinkTextDecoration,
                  ),
                ),
              ),
            ),
          ),
        ),
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          crossAxisAlignment: CrossAxisAlignment.center,
          children: <Widget>[
            Column(
              children: <Widget>[
                Container(
                    margin: const EdgeInsets.only(top: 128),
                    child: CircleAvatar(
                        radius: 88,
                        backgroundImage: NetworkImage(
                            "https://avatars0.githubusercontent.com/u/6892529"))),
                Container(
                  margin: const EdgeInsets.only(top: 48),
                  child: Text("I'm Drilon Reçica.",
                      textAlign: TextAlign.center,
                      style: TextStyle(
                          fontSize: 88,
                          color: Colors.white,
                          fontFamily: "Roboto",
                          fontWeight: FontWeight.bold)),
                ),
                Container(
                  margin: const EdgeInsets.only(top: 16),
                  child: RichText(
                    textAlign: TextAlign.center,
                    text: TextSpan(
                      style: TextStyle(
                        fontSize: 20.0,
                        fontFamily: "Roboto",
                        color: Colors.grey,
                      ),
                      children: <TextSpan>[
                        TextSpan(
                            text:
                                'Android App Developer, Tech Enthusiast, Electronics Hobbyist',
                            style: TextStyle(
                                fontWeight: FontWeight.bold,
                                fontFamily: "Roboto",
                                color: Colors.white)),
                      ],
                    ),
                  ),
                ),
                Padding(
                  padding: EdgeInsets.only(top: 32),
                  child: Row(children: <Widget>[
                    MouseRegion(
                      onEnter: (onHover) {
                        setState(() {
                          innerColorList[0] = Colors.white30;
                        });
                      },
                      onExit: (onHover) {
                        setState(() {
                          innerColorList[0] = Colors.transparent;
                        });
                      },
                      child: Padding(
                        padding: EdgeInsets.only(left: 16, right: 16),
                        child: InkWell(
                          onTap: () {
                            _openLink("https://www.github.com/drilonrecica",
                                "Drilon's Github");
                          },
                          child: CircleBorderImage(
                            width: 64.0,
                            height: 64.0,
                            innerColor: innerColorList[0],
                            circleColor: circleColor,
                            borderSize: 2,
                            image: Icon(
                              FontAwesomeIcons.github,
                              color: Colors.white,
                            ),
                          ),
                        ),
                      ),
                    ),
                    MouseRegion(
                      onEnter: (onHover) {
                        setState(() {
                          innerColorList[1] = Colors.white30;
                        });
                      },
                      onExit: (onHover) {
                        setState(() {
                          innerColorList[1] = Colors.transparent;
                        });
                      },
                      child: Padding(
                        padding: EdgeInsets.only(left: 16, right: 16),
                        child: InkWell(
                          onTap: () {
                            _openLink("https://stackoverflow.com/users/3392276",
                                "Drilon's Stackoverflow");
                          },
                          child: CircleBorderImage(
                            width: 64.0,
                            height: 64.0,
                            innerColor: innerColorList[1],
                            circleColor: circleColor,
                            borderSize: 2,
                            image: Icon(
                              FontAwesomeIcons.stackOverflow,
                              color: Colors.white,
                            ),
                          ),
                        ),
                      ),
                    ),
                    MouseRegion(
                      onEnter: (onHover) {
                        setState(() {
                          innerColorList[2] = Colors.white30;
                        });
                      },
                      onExit: (onHover) {
                        setState(() {
                          innerColorList[2] = Colors.transparent;
                        });
                      },
                      child: Padding(
                        padding: EdgeInsets.only(left: 16, right: 16),
                        child: InkWell(
                          onTap: () {
                            _openLink("mailto:github@drilon.recica.com",
                                "Drilon's E-mail");
                          },
                          child: CircleBorderImage(
                            width: 64.0,
                            height: 64.0,
                            innerColor: innerColorList[2],
                            circleColor: circleColor,
                            borderSize: 2,
                            image: Icon(
                              Icons.email,
                              color: Colors.white,
                            ),
                          ),
                        ),
                      ),
                    ),
                    MouseRegion(
                      onEnter: (onHover) {
                        setState(() {
                          innerColorList[3] = Colors.white30;
                        });
                      },
                      onExit: (onHover) {
                        setState(() {
                          innerColorList[3] = Colors.transparent;
                        });
                      },
                      child: Padding(
                        padding: EdgeInsets.only(left: 16, right: 16),
                        child: InkWell(
                          onTap: () {
                            _openLink("https://twitter.com/drilonre",
                                "Drilon's Twitter");
                          },
                          child: CircleBorderImage(
                            width: 64.0,
                            height: 64.0,
                            innerColor: innerColorList[3],
                            circleColor: circleColor,
                            borderSize: 2,
                            image: Icon(
                              FontAwesomeIcons.twitter,
                              color: Colors.white,
                            ),
                          ),
                        ),
                      ),
                    ),
                    MouseRegion(
                      onEnter: (onHover) {
                        setState(() {
                          innerColorList[4] = Colors.white30;
                        });
                      },
                      onExit: (onHover) {
                        setState(() {
                          innerColorList[4] = Colors.transparent;
                        });
                      },
                      child: Padding(
                        padding: EdgeInsets.only(left: 16, right: 16),
                        child: InkWell(
                          onTap: () {
                            _openLink("https://facebook.com/iamdrilon",
                                "Drilon's Facebook");
                          },
                          child: CircleBorderImage(
                            width: 64.0,
                            height: 64.0,
                            innerColor: innerColorList[4],
                            circleColor: circleColor,
                            borderSize: 2,
                            image: Icon(
                              FontAwesomeIcons.facebookF,
                              color: Colors.white,
                            ),
                          ),
                        ),
                      ),
                    ),
                    MouseRegion(
                      onEnter: (onHover) {
                        setState(() {
                          innerColorList[5] = Colors.white30;
                        });
                      },
                      onExit: (onHover) {
                        setState(() {
                          innerColorList[5] = Colors.transparent;
                        });
                      },
                      child: Padding(
                        padding: EdgeInsets.only(left: 16, right: 16),
                        child: InkWell(
                          onTap: () {
                            _openLink("https://www.instagram.com/iamdrilonre/",
                                "Drilon's Instagram");
                          },
                          child: CircleBorderImage(
                            width: 64.0,
                            height: 64.0,
                            innerColor: innerColorList[5],
                            circleColor: circleColor,
                            borderSize: 2,
                            image: Icon(
                              FontAwesomeIcons.instagram,
                              color: Colors.white,
                            ),
                          ),
                        ),
                      ),
                    ),
                  ]),
                ),
              ],
            )
          ],
        ),
      ],
    );
  }
}

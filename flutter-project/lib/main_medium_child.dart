import 'package:drilonrecica/circle_border_image.dart';
import 'package:flutter_web/material.dart';
import 'dart:html' as html;

class MediumBody extends StatelessWidget {
  const MediumBody({Key key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: <Widget>[
        Column(children: <Widget>[
          Expanded(
            child: Image.asset(
              "images/prishtina.jpg",
              fit: BoxFit.cover,
            ),
          )
        ]),
        Container(
          color: Color.fromRGBO(0, 0, 0, 0.60),
        ),
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          crossAxisAlignment: CrossAxisAlignment.center,
          children: <Widget>[
            Column(
              children: <Widget>[
                Container(
                    margin: const EdgeInsets.only(top: 112),
                    child: CircleAvatar(
                        radius: 80,
                        backgroundImage: NetworkImage(
                            "https://avatars0.githubusercontent.com/u/6892529"))),
                Container(
                  margin: const EdgeInsets.only(top: 48),
                  child: Text("I'm Drilon Reçica.",
                      textAlign: TextAlign.center,
                      style: TextStyle(
                          fontSize: 64,
                          fontFamily: "Roboto",
                          color: Colors.white,
                          fontWeight: FontWeight.bold)),
                ),
                Container(
                  margin: const EdgeInsets.only(top: 16),
                  child: RichText(
                    textAlign: TextAlign.center,
                    text: TextSpan(
                      // Note: Styles for TextSpans must be explicitly defined.
                      // Child text spans will inherit styles from parent
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
                    padding: EdgeInsets.only(top: 24),
                    child: Row(children: <Widget>[
                      Padding(
                        padding: EdgeInsets.only(left: 16, right: 16),
                        child: InkWell(
                          onTap: () {
                            html.window.open(
                                "https://www.github.com/drilonrecica",
                                "Drilons Github");
                          },
                          child: CircleBorderImage(
                            width: 48.0,
                            height: 48.0,
                            circleColor: Colors.white,
                            borderSize: 2,
                            image: Image.asset("images/github_icon.png"),
                          ),
                        ),
                      ),
                      Padding(
                        padding: EdgeInsets.only(left: 16, right: 16),
                        child: InkWell(
                          onTap: () {
                            html.window.open(
                                "https://stackoverflow.com/users/3392276",
                                "Drilon's Stackoverflow");
                          },
                          child: CircleBorderImage(
                            width: 48.0,
                            height: 48.0,
                            circleColor: Colors.white,
                            borderSize: 2,
                            image: Image.asset("images/stackoverflow_icon.png"),
                          ),
                        ),
                      ),
                      Padding(
                        padding: EdgeInsets.only(left: 16, right: 16),
                        child: InkWell(
                          onTap: () {
                            html.window.open(
                                "github@drilon.reqica.com", "Drilon's Email");
                          },
                          child: CircleBorderImage(
                            width: 48.0,
                            height: 48.0,
                            circleColor: Colors.white,
                            borderSize: 2,
                            image: Image.asset("images/email_icon.png"),
                          ),
                        ),
                      ),
                      Padding(
                        padding: EdgeInsets.only(left: 16, right: 16),
                        child: InkWell(
                          onTap: () {
                            html.window.open("https://facebook.com/iamdrilon",
                                "Drilon's Facebook");
                          },
                          child: CircleBorderImage(
                            width: 48.0,
                            height: 48.0,
                            circleColor: Colors.white,
                            borderSize: 2,
                            image: Image.asset("images/facebook_icon.png"),
                          ),
                        ),
                      ),
                      Padding(
                        padding: EdgeInsets.only(left: 16, right: 16),
                        child: InkWell(
                          onTap: () {
                            html.window.open(
                                "https://www.instagram.com/iamdrilonre/",
                                "Drilon's Instagram");
                          },
                          child: CircleBorderImage(
                            width: 48.0,
                            height: 48.0,
                            circleColor: Colors.white,
                            borderSize: 2,
                            image: Image.asset("images/instagram_icon.png"),
                          ),
                        ),
                      ),
                    ]))
              ],
            )
          ],
        ),
        InkWell(
          onTap: () {
            html.window.open("http://drilonrecica.github.io/", "");
          },
          child: Padding(
            padding: EdgeInsets.all(32),
            child: Align(
              alignment: Alignment.bottomLeft,
              child: Text(
                "Drilon Reçica",
                style: TextStyle(
                    color: Colors.white,
                    fontFamily: "Roboto",
                    fontWeight: FontWeight.bold,
                    fontSize: 16),
              ),
            ),
          ),
        ),
        InkWell(
          onTap: () {
            html.window.open("https://flutter.dev/web", "");
          },
          child: Padding(
            padding: EdgeInsets.all(32),
            child: Align(
              alignment: Alignment.bottomRight,
              child: Text(
                "Made with Flutter Web",
                style: TextStyle(
                  color: Colors.white,
                  fontFamily: "Roboto",
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
          ),
        ),
      ],
    );
  }
}

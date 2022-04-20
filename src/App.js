import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "react-bootstrap/Navbar";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import { BrowserRouter, useNavigate } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import React, { useState } from "react";
import Card from "react-bootstrap/Card";
import { CardGroup } from "react-bootstrap";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import "./App.css";

export default function App() {
  return (
    <BrowserRouter>
      <div>
        <Navbar bg="primary" variant="dark" expand="lg">
          <Container>
            <Nav>
              <LinkContainer to={"/"}>
                <Nav.Link>Home</Nav.Link>
              </LinkContainer>
              <LinkContainer to={"/news"}>
                <Nav.Link>News Articles</Nav.Link>
              </LinkContainer>
              <LinkContainer to={"/topheadlines"}>
                <Nav.Link>Top Headlines</Nav.Link>
              </LinkContainer>
            </Nav>
          </Container>
        </Navbar>

        <Container>
          <Routes>
            <Route path={"/"} element={<Home />} />
            <Route path={"/home"} element={<Home />} />
            <Route path={"/news"} element={<News />} />
            <Route path={"/topheadlines"} element={<Headlines />} />
            <Route path={"*"} element={<NotFoundPage />} />
          </Routes>
        </Container>
      </div>
    </BrowserRouter>
  );
}
function Home() {
  var navigate = useNavigate();
  var buttonClickOption1 = () => {
    navigate("/news");
  };
  var buttonClickOption2 = () => {
    navigate("/topheadlines");
  };

  return (
    <div>
      <br />
      <h1>News Web app</h1>
      <br />
      <CardGroup>
        <Card style={{ width: "18rem" }} className="text-center">
          <Card.Header>WorldWide News</Card.Header>
          <Card.Body>
            <Card.Title>Search news</Card.Title>
            <Card.Subtitle className="mb-2 text-muted">
              Global news from news sources and blogs
            </Card.Subtitle>
            <Card.Text>
              Search the newest articles that mention a specific keyword
            </Card.Text>
            <Button
              variant="btn btn-outline-primary"
              onClick={buttonClickOption1}
            >
              Navigate
            </Button>
          </Card.Body>
        </Card>
        <br />
        <br />
        <Card style={{ width: "18rem" }} className="text-center">
          <Card.Header>Specific News</Card.Header>
          <Card.Body>
            <Card.Title>Top headlines</Card.Title>
            <Card.Subtitle className="mb-2 text-muted">
              Top and breaking headlines
            </Card.Subtitle>
            <Card.Text>
              Get the current top headlines for a specific category in a country
            </Card.Text>
            <Button
              variant="btn btn-outline-primary"
              onClick={buttonClickOption2}
            >
              Navigate
            </Button>
          </Card.Body>
        </Card>
      </CardGroup>
    </div>
  );
}

function News() {
  const [keyword, setKeywords] = useState("");
  const [articles, setArticles] = useState([]);
  const [error_var, setError] = useState(false);
  const [error_api, setErrorApi] = useState(false);
  const [success_api, setSuccessApi] = useState(false);

  var onChange = (event) => {
    setKeywords(event.target.value);
    setSuccessApi(false);
    setError(false);
    setErrorApi(false);
  };

  var handleClick = () => {
    if (keyword === "") {
      setError(true);
    } else {
      setError(false);
      fetch(
        "https://newsapi.org/v2/everything?q=" +
          keyword +
          "&language=en&sortBy=publishedAt&apiKey=3fab4f24bbbe4bab8b12116b048eb6fc"
      )
        .then((response) => response.json())
        .then((json) => {
          if (json.status === "ok" && json.totalResults === 0) {
            setErrorApi(true);
          } else {
            setArticles(json.articles);
            setSuccessApi(true);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  return (
    <div>
      <br />
      <h1>Search news</h1>
      <Form>
        <Form.Group className="mb-3" controlId="formBasicKeyword">
          <Form.Label>Enter a keyword</Form.Label>
          <Form.Control type="text" onChange={onChange} />
        </Form.Group>
        <Button
          variant="btn btn-outline-primary"
          type="button"
          onClick={handleClick}
        >
          Get News
        </Button>
      </Form>
      <br />
      <ErrorMessage
        message={"You need to enter a keyword!"}
        visible={error_var}
      />
      <br />
      <ErrorMessage
        message={"API failed or no results. Try again!"}
        visible={error_api}
      />
      <br />
      <div>
        <Result result={articles} visible={success_api} />
      </div>
    </div>
  );
}

function Result(props) {
  if (props.visible) {
    var articles = props.result;
    return (
      <div>
        <br />
        <Row xs={1} md={3}>
          {articles.map((element) => (
            <Col>
              <Card>
                <Card.Body>
                  <Card.Img variant="top" src={element.urlToImage} />
                  <Card.Title>{element.title}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">
                    {element.author}
                  </Card.Subtitle>
                  <Card.Text>{element.description}</Card.Text>
                  <Card.Link href={element.url}>{element.url}</Card.Link>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    );
  } else {
    return <span></span>;
  }
}

function Headlines() {
  const [country, setCountry] = useState("au");
  const [category, setCategory] = useState("business");
  const [articles, setArticles] = useState([]);
  const [error_api, setErrorApi] = useState(false);
  const [success_api, setSuccessApi] = useState(false);

  var onCountry = (event) => {
    setCountry(event.target.value);
    setSuccessApi(false);
    setErrorApi(false);
  };
  var onCategory = (event) => {
    setCategory(event.target.value);
    setSuccessApi(false);
    setErrorApi(false);
  };
  var ApiInfo = () => {
    fetch(
      "https://newsapi.org/v2/top-headlines?country=" +
        country +
        "&category=" +
        category +
        "&apiKey=3fab4f24bbbe4bab8b12116b048eb6fc"
    )
      .then((response) => response.json())
      .then((json) => {
        if (json.status === "ok" && json.totalResults === 0) {
          setErrorApi(true);
        } else {
          setArticles(json.articles);
          setSuccessApi(true);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div>
      <br />
      <h1>Top headlines</h1>
      <Form>
        <Form.Label>Category</Form.Label>
        <Form.Group className="mb-4" controlId="formSelectCategory">
          <Form.Select id="category" onChange={onCategory}>
            <option value="business">business</option>
            <option value="entertainment">entertainment</option>
            <option value="general">general</option>
            <option value="health">health</option>
            <option value="science">science</option>
            <option value="sports">sports</option>
            <option value="technology">technology</option>
          </Form.Select>
        </Form.Group>
        <Form.Label>Country</Form.Label>
        <Form.Group className="mb-4" controlId="formSelectCountry">
          <Form.Select id="country" onChange={onCountry}>
            <option value="au">Australia</option>
            <option value="ca">Canada</option>
            <option value="cn">China</option>
            <option value="co">Colombia</option>
            <option value="fr">France</option>
            <option value="de">Germany</option>
            <option value="in">India</option>
            <option value="ie">Ireland</option>
            <option value="it">Italy</option>
            <option value="jp">Japan</option>
            <option value="kr">Korea</option>
            <option value="mx">Mexico</option>
            <option value="pt">Portugal</option>
            <option value="za">South Africa</option>
            <option value="ch">Switzerland</option>
            <option value="ua">Ukraine</option>
            <option value="uk">United Kingdom</option>
            <option value="us">United States of America</option>
          </Form.Select>
        </Form.Group>
        <Button
          variant="btn btn-outline-primary"
          type="button"
          onClick={ApiInfo}
        >
          Get headlines
        </Button>
      </Form>
      <br />
      <ErrorMessage
        message={"API failed or no results. Try again!"}
        visible={error_api}
      />
      <br />
      <Result result={articles} visible={success_api} />
    </div>
  );
}

function NotFoundPage() {
  return (
    <div>
      <h1>404</h1>
      <h2>Page Not Found</h2>
    </div>
  );
}

function ErrorMessage(props) {
  if (!props.visible) {
    return <span></span>;
  }
  return <span style={{ color: "red" }}>{props.message}</span>;
}